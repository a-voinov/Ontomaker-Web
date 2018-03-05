var app = new Vue({
	el: '#app',
	data: {
		TAB_CNL: 'CNL',
		TAB_TRIPLETS: 'TRIPLETS',
		TAB_OWL: 'OWL',
		TAB_VOWL: 'VOWL',


		showLoadingModal: false,
		showLoadOwlModal: false,
		isOwlLoaded: false, //OWL уже загружен
		isOwlLoading: false, //OWL загружается

		showEmptyCnlModal: false,
		emptyCnlMessage: '',
		curTab: 'CNL',

		iri: '',
		cnl: '',
		owl: '',
		triplets: '',
		serviceLink: '/Owl',
		vowlLink: 'http://localhost:8080/webvowl_1.0.6/',
		activeIndex:'CNL'
	},
	methods:{
		getOWL: function(){
			$.ajax({
              type: "Post",
              url: this.$data.serviceLink,
              data: {cnl: this.$data.cnl},
              success: function(a){
              	console.log(a);
              	app.$data.owl  = a;
              },
              dataType: 'text'
            });
		},
		loadVOWL: function(){
			$('#vowlFrame').attr('src', this.$data.vowlLink);
		},
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
		sendCNL: function(){
			var v = this.$data;
			var iri = v.iri;
			v.isOwlLoading = true;
			console.log("sending cnl...");

		},
		checkEmptyCnl: function(){
			return $('#keaArea').val() == '' ? true : false;
		},
		openCnlTab: function(){
			app.$refs.menu.items.CNL.handleClick();
		},
		keaKeyDown:function(e){
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