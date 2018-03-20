/**
 * Ontomaker frontend
 * Created by Войнов А.А.
 * СГУПС ФБИ 2018
 */

Vue.directive('focus',{
	inserted: function(el){
		el.focus()
	}
});

var app = new Vue({
	el: '#app',
	//````````````````````ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ПРИЛОЖЕНИЯ````````````````````````
	data: {
		//ссылки
		serviceLink: '/Owl',
		vowlLink: 'http://localhost:8080/webvowl_1.0.6/',
		appLink: 'http://localhost:8888/',
		normalizeLink: 'https://rucnlparser.herokuapp.com/normtable/',
		//индексы вкладок
		TAB_CNL: 'CNL',
		TAB_TRIPLETS: 'TRIPLETS',
		TAB_OWL: 'OWL',
		TAB_VOWL: 'VOWL',
		//текущая открытая вкладка
		curTab: 'CNL',
		curMenuItem:'edit',
		//флаги открытия модальных окон
		showLoadingModal: false,
		showLoadOwlModal: false,
		showEmptyCnlModal: false,
		showOWLErrorModal: false,
		//OWL уже загружен
		isOwlLoaded: false,
		//OWL в процессе загрузки
		isOwlLoading: false,
		//граф уже загружен
		isVowlLoaded: false,
		//сообщение об ошибке загрузки (если текст КЕЯ не введен)
		emptyCnlMessage: '',
		//сообщение об ошибке генерации OWL
		OWLErrMessage: '',
		//сообщение о статусе загрузки
		loadingWindowMessage: '',
		//отображение CNLAREA
		cnlAreaShow: false,
		//отображение фрейма
		showFrame: false,
		//данные триплетов
		tripletsArray: [],
		//отображение визуализации исходного текста
		colorizedAreaShow: false,
		//данные нормализованного текста
		normalData: {},
		//карта нормализованый объект(субъект)-цвет
		normalObjectColorMap: {},
		//название выбранного субъекта
		subjName: '',
		//объекты выбранного субъекта
		objects: [],
		//отношения выбранного субъекта
		relations: [],
		//история текта
		textHistory: [],
		//переменные модели
		iri: '',
		cnl: '',
		raw: '', //исходный текст
		colorizedRaw: '', //исходный текст с html разметкой
		owl: '',
		triplets: '',
		owlURL: '',
		cnl_content: '',
		//переменные расцветки КЕЯ
        baseColors: [ // базовые цвета (RGB)
            [45, 152, 45], //зеленый
            [75, 250, 234], //голубой
            [243, 255, 62], //желтый
            [70, 153, 255] //фиолетовый
        ],
        colorIndex: 0, //индекс базового цвета
        minColorIndex: 0,
        maxColorIndex: 3,
        shadeStep: 0, // переменная генерации оттенка
        minShadeStep: 1,
        maxShadeStep: 4
	},
	//````````````````````МЕТОДЫ ПРИЛОЖЕНИЯ````````````````````````
	methods:{
		//Обработка успешного завершения запроса получения OWL
		getOWLSuccessHandle: function(res){
			var v = this.$data;
			//сохранить данные
			var json = JSON.parse(res);
			v.owl = json.OWL;
			v.triplets = json.frameJSON;
			v.tripletsArray = this.parseTriplets(v.triplets);
			v.owlURL = json.OWLServerPath;
			if (v.curTab==v.TAB_VOWL){
				this.loadVOWL();
			}
			//закрыть окно загрузки
			v.showLoadingModal = false;
			//обновить переменные статуса загрузки
			v.isOwlLoading = false;
			v.isOwlLoaded = true;
			//раскрасить исходный текcт
			this.highlight();
		},
		//Обработка НЕуспешного завершения запроса получения OWL
		getOWLErrorHandle: function(res){
			var v = this.$data;
			//обновить переменные статуса загрузки
			v.isOwlLoading = false;
			//закрыть окно загрузки
			v.showLoadingModal = false;
			//отобразить окно с ошибкой
			v.OWLErrMessage = res.replace("ERROR:", "");
			v.showOWLErrorModal = true;
        },
		//Ассинхронный запрос получения OWL
		getOWL: function(){
			$.ajax({
              type: "Post",
              url: this.$data.serviceLink,
              data: {
              	iri: this.$data.iri,
              	cnl: this.$data.cnl
              },
              success: function(res){
              	//error check
              	if (res.includes("ERROR:")){
              		app.getOWLErrorHandle(res);
              	} else {
					app.getOWLSuccessHandle(res);
                }
              },
              dataType: 'text'
            });
		},
		//Открытие фрейма с приложением WebVOWL
		loadVOWL: function(){
			if (this.$data.isVowlLoaded) return;
			var url = "#url=" + this.$data.appLink + this.$data.owlURL;
			var vowlLink = this.$data.vowlLink;
			setTimeout(
			function(){
				$('#vowlFrame').attr('src', vowlLink + url);
			},1000);
			isVowlLoaded = true;
		},
		//Обработка выбора вкладки главного меню
		handleMenuSelect: function(index, indexPath){
			var v = this.$data;
			v.curTab = index;
			switch (index){
				case v.TAB_TRIPLETS:
					this.beginSendCNL(' загрузки триплетов');
				break;
				case v.TAB_OWL:
					this.beginSendCNL(' загрузки OWL');
				break;
				case v.TAB_VOWL:
					if (v.isOwlLoaded && !v.isVowlLoaded){
						this.loadVOWL();
					}
					this.beginSendCNL(' отображения VOWL');
				break;
			}
		},
		//Запуск проверок введенных данных перед отображением диалогового окна старта генерации онтологии
		beginSendCNL: function(emptyErrorText){
			var v = this.$data;
			if (this.checkEmptyCnl()) { //проверка заполненности КЕЯ
				v.emptyCnlMessage = emptyErrorText;
				v.showEmptyCnlModal = true;
				return;
			}
			if (!v.isOwlLoaded && !v.isOwlLoading){
				v.iri = '';
				v.showLoadOwlModal = true;
			}
		},
		//Отправка КЕЯ на сервер
		sendCNL: function(){
			var v = this.$data;
			var iri = v.iri;
			v.isOwlLoading = true;
			v.showLoadingModal = true;
			v.loadingWindowMessage = "Генерация OWL...";
			this.getOWL();
			console.log("sending cnl...");
		},
		//Проверка заполненности КЕЯ
		checkEmptyCnl: function(){
			return $('#keaArea').val() == '' ? true : false;
		},
		//Открытие первой вкладки с текстом
		openCnlTab: function(){
			app.$refs.menu.items.CNL.handleClick();
		},
		//открытие второй вкладки с фреймом
        openFrameTab: function(){
            app.$refs.menu.items.TRIPLETS.handleClick();
        },
		//Обработка вводимого текста в окне редактора КЕЯ
		keaKeyDown:function(e){
			//поддержка табуляции
			var TABKEY = 9;
			if(e.keyCode == TABKEY) {
				var $txt = jQuery("#keaArea");
				var caretPos = $txt[0].selectionStart;
				var textAreaTxt = $txt.val();
				var tab = "\t";
				$txt.val(textAreaTxt.substring(0, caretPos) + tab + textAreaTxt.substring(caretPos) );
				$txt.selectRange(caretPos + 1);
				if(e.preventDefault) {
					e.preventDefault();
				}
				return false;
			}
		},
		highlight(){
			var v = this.$data;
			this.updateCnlText();
			v.cnlAreaShow = true;
			this.colorizeText();
			v.colorizedAreaShow = true;
		},
		getNormalText(){
			var v = this.$data;
			var that = this;
			$.ajax({
			  type: "Post",
			  url: v.normalizeLink,
			  data: {
				text: v.raw
			  },
			  success: function(res){
				var json = JSON.parse(res);
				console.log('normalized data received');
				that.parseNormalText(json);
			  },
			  dataType: 'text'
			});
		},
        //обработка нормализованного текста, поиск объектов и их подсвечивание
		parseNormalText(json){
			var normalArr = json.normaltext;
			var v = this.$data;
            var text = v.raw;
            var res = "";
            var i = 0;
            var j = 0;
            var k = 0;
            var skipWords = 0;
            //Обработка массива с КЕЯ, очистка текста от нижних подчеркиваний между словами, дополнение объекта КЕЯ массивом слов словосочетания.
            var words = [];
            $.each(v.normalObjectColorMap, function(index, value){
                var collocation = index;
                var wordsArr = collocation.split('_');
                words.push(wordsArr);
            });
            //Сортировка объектов КЕЯ по количеству слов по убыванию
            words.sort(function(a, b){
                return b.length - a.length;
            });
            //Цикл по тексту
            normalArr.forEach(function(norm){
                //пропуск слов
                if (skipWords > 0) { skipWords--; i++; return; }
                 //Цикл по отсортированному массиву с КЕЯ
                 j = 0;
                 try{
                 words.forEach(function(cnlArr){
                    //Проверка первого слова КЕЯ на соответствие первому слову текста
                    if (cnlArr[0] === norm.normalword){
                        var success = true;
                        var notNormalColloc = norm.word; // ненормализованное сочетание слов
                        var normalColloc = norm.normalword; //нормализованное сочетание слов
                        //Цикл по словосочетанию КЕЯ
                        if (cnlArr.length > 1)
                        for (k = 1; k <= cnlArr.length - 1; k++){
                            //  ПРОВЕРКА НА выход за пределы массива слов
                            if (i + k >= normalArr.length) {
                                success = false;
                                break;
                            }
                            // Получение следующего слова из текста
                            var nextWord = normalArr[i + k];
                            //Сравнение слова из текста и следующего слова из КЕЯ
                            if (nextWord.normalword !== cnlArr[k]){
                                success = false;
                                break;
                            }
                            notNormalColloc += " " + nextWord.word;
                            normalColloc += "_" + nextWord.normalword;
                        }
                        if (success){
                            //цикл k завершен УСПЕШНО (все слова в КЕЯ совпали со словосочетанием из текста)
                            //подсвечиваем словосочетание с НЕнормализованым текстом
                            var index = text.indexOf(notNormalColloc);
                            res += text.substring(0, index);
                            var newWord = "<span class='cnl-token triplet-unit' @click='addToTextHistory(\"" + notNormalColloc + "\"); showTriplets(\"" + notNormalColloc + "\"); openFrameTab' style='background-color:" + v.normalObjectColorMap[normalColloc].bg + "; color: " + v.normalObjectColorMap[normalColloc].color + "'>" + notNormalColloc + "</span>";
                            res += newWord;
                            text = text.substring(index + notNormalColloc.length, text.length);
                            // Сохраняем количество пропусков цикла
                            skipWords = cnlArr.length - 1;
                            throw "OK";
                        }
                    }
                    j++;
                 });
                 } catch (e){}
                 i++;
            });
            //````````````````````````````
            res += text;
			res = res.replace(/\n/g, "<br/>");
			v.colorizedRaw = res;

            var vue = this;
			//рендеринг события click
            new Vue({
                render: Vue.compile('<div id="colorizedPlaceholder" class="colorized-text" >' + res + '</div>').render,
                methods: {
                    showTriplets(t) {
                        vue.showTriplets(t);
                    },
                    addToTextHistory(t){
                        vue.addToTextHistory(t);
                    },
                    openFrameTab(){
                        vue.openFrameTab();
                    }
                }
            }).$mount('#colorizedPlaceholder');
		},
		colorizeText(){
			var v = this.$data;
			var text = v.raw;
			text = text.replace(/\n/g, "<br/>");
			if (!v.isOwlLoaded){
				v.colorizedRaw = text;
			} else {
				v.colorizedRaw = '<i style="font-size:48px" class="el-icon-loading"></i>';
				this.getNormalText();
			}
		},
		//рисование КЕЯ
		updateCnlText () {
			var tabTag = '<i class="leftborder">&nbsp;&nbsp;</i>';
			var tabIcon = '<i class="el-icon-caret-right leftborder"></i>';
			var lines = this.$data.cnl.split("\n");
			var content = "";
			lines.forEach(function(line){
				var newLine = "";
				var tabCount = (line.match(/\t/g)||[]).length;
				if (tabCount > 1){
					for (var t=0; t < tabCount + 1; t++) { newLine+=tabTag; }
					newLine += tabIcon;
				} else if (tabCount === 1){
					newLine += tabTag + tabIcon;
				} else if (tabCount === 0){
					newLine = tabIcon;
				}
				var color = "black";
				var text = line.replace("\t", "").trim();
				if (tabCount % 2 != 0){
					if (text === "подкласс"){
						color = "lightseagreen";
					} else {
						color = "red";
					}
				}
				newLine += "<span class='triplet-unit' @click='addToTextHistory(\"" + text + "\"); showTriplets(\"" + text + "\")' style='color:" + color + "'>" + text;
				content += newLine + "</span><br/>";
			});

			this.$data.cnl_content = content;

			var v = this;
			//рендеринг события click
			new Vue({
				render: Vue.compile('<div id="cnlPlaceholder" class="cnl" >' + content + '</div>').render,
				methods: {
					showTriplets(text) {
						v.showTriplets(text);
					},
					addToTextHistory(text){
						v.addToTextHistory(text);
					}
				}
			}).$mount('#cnlPlaceholder');

		},
		addToTextHistory(text){
			var h = this.$data.textHistory;
			if (h[h.length - 1] != text)
				h.push(text);
		},
		showTriplets(text){
			var v = this.$data;
			if (!v.isOwlLoaded){
				return;
			}
			v.showFrame = true;
			v.subjName = text;
			if (v.tripletsArray[text] != undefined){
				v.objects = v.tripletsArray[text].objects;
				v.relations = v.tripletsArray[text].relations;
			} else {
				v.objects = [];
				v.relations = [];
			}
		},
		showPrevFrame(){
			var h = this.$data.textHistory;
			h.pop();
			text = h[h.length - 1];
			this.showTriplets(text);
		},
		parseTriplets(triplets){
			var json = JSON.parse(triplets);
			console.log(json);
			var usedT = [];
			var res = {};
			var color = 'green';
			var that = this;
			json.triplets.forEach(function(t){
				var s = t.subjectorigin;
				if (usedT.includes(s)) return;
				//присвоеение цвета субъекту
				that.addObjectColor(t.subject, color);
				usedT.push(s);
				var f = json.triplets.filter(x => x.subjectorigin === s);
				//запись предикатов субъекта в отдельный массив
				var relations = f.map(x => x.relationorigin);
				//remove duplicates
				var oldR = '';
				var rC = 0;
				relations.forEach(function(r){
					if (oldR === r) relations[rC] = '';
					oldR = r;
					rC++;
				});
			 	//запись объектов субъекта в отдельный массив
				var objects = f.map(x => x.objectorigin);
				//присвоение цвета каждому объекту (нормализованной форме объекта)
				var normalObjects = f.map(x => x.object);
				normalObjects.forEach(function(o){
					that.addObjectColor(o, color);
				});

				res[s] = {"relations":relations, "objects":objects};
			});
			return res;
		},
		addObjectColor(obj, color){
			var v = this.$data;
			if (!v.normalObjectColorMap.hasOwnProperty(obj)){
			    var shade = this.generateShade();
				v.normalObjectColorMap[obj] = {color: shade.color, bg: shade.bg};
			}
		},
		generateShade(){
            var v = this.$data;
            var r = v.baseColors[v.colorIndex][0];
            var g = v.baseColors[v.colorIndex][1];
            var b = v.baseColors[v.colorIndex][2];
            var max = Math.max(r,Math.max(g,b));
            var step = 255 / (max * 3);
            v.shadeStep += 1;
            if (v.shadeStep > v.maxShadeStep) {
                v.shadeStep = v.minShadeStep;
                v.colorIndex++;
                if (v.colorIndex > v.maxColorIndex){
                    v.colorIndex = v.minColorIndex;
                }
            }
            var newR = r * step * v.shadeStep + 10;
            var newG = g * step * v.shadeStep - 10;
            var newB = b * step * v.shadeStep + 15;
            var sum = newR + newG + newB;
            var textColor = 'white'
            if (sum >= 300) {textColor = 'black'};
            if (newB > 170 && newR < 110 && newG <= 160) {textColor = 'white'};
            if (newB > 50 && newR < 180 && newG <= 160) {textColor = 'white'};
            return {color: textColor, bg:"rgba(" + Math.ceil(newR) + ',' + Math.ceil(newG) + ',' + Math.ceil(newB) + ', 1)'};
		}
	}
});