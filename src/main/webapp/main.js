/**
 * Ontomaker frontend
 * Created by Войнов А.А.
 * СГУПС ФБИ 2018
 */
var app = new Vue({
	el: '#app',
	//````````````````````ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ПРИЛОЖЕНИЯ````````````````````````
	data: {
		//константы
		serviceLink: '/Owl',
		vowlLink: 'http://localhost:8080/webvowl_1.0.6/',
		appLink: 'http://localhost:8888/',
		//индексы вкладок
		TAB_CNL: 'CNL',
		TAB_TRIPLETS: 'TRIPLETS',
		TAB_OWL: 'OWL',
		TAB_VOWL: 'VOWL',
		//текущая открытая вкладка
		curTab: 'CNL',
		//флаги открытия модальных окон
		showLoadingModal: false,
		showLoadOwlModal: false,
		showEmptyCnlModal: false,
		showOWLErrorModal: false,
		//OWL уже загружен
		isOwlLoaded: false,
		//OWL в процессе загрузки
		isOwlLoading: false,
		//сообщение об ошибке загрузки (если текст КЕЯ не введен)
		emptyCnlMessage: '',
		//сообщение об ошибке генерации OWL
		OWLErrMessage: '',
		//сообщение о статусе загрузки
		loadingWindowMessage: '',
		//переменные модели
		iri: '',
		cnl: '',
		owl: '',
		triplets: '',
		owlURL: ''
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
			v.owlURL = json.OWLServerPath;
			this.loadVOWL();
			//закрыть окно загрузки
			v.showLoadingModal = false;
			//обновить переменные статуса загрузки
			v.isOwlLoading = false;
			v.isOwlLoaded = true;
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
		//Ассинхронный запрос получения OWL на сервер
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
			var url = "#url=" + this.$data.appLink + this.$data.owlURL;
			var vowlLink = this.$data.vowlLink;
			setTimeout(
			function(){
				$('#vowlFrame').attr('src', vowlLink + url);
			},1000);
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
		//Открытие первой вкладки меню с КЕЯ
		openCnlTab: function(){
			app.$refs.menu.items.CNL.handleClick();
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
		}
	}
});