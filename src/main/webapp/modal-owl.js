var closeClick = "$emit('close')";
var okClick = "$emit('ok')";
// register modal component
Vue.component('modal-owl', {
  props: ['iri'],
  template: '<transition name="modal">'+
             	'<div class="modal-mask">'+
             		'<div class="modal-wrapper">'+
             			'<div class="modal-container">'+

             				'<div class="modal-header">'+
             					'<slot name="header">'+
             						'default header'+
             					'</slot>'+
             				'</div>'+

             				'<div class="modal-body">'+
             					'<slot name="body">'+
             						'default body'+
             					'</slot>'+
             					'<slot name="body-add">'+
             					'</slot>'+
             				'</div>'+

             				'<div class="modal-footer">'+
             					'<slot name="footer">'+
             						'default footer'+
             					'</slot>'+
             				'</div>'+

             				'<button style="margin-left :10px" class="modal-default-button" @click="' + closeClick + '">'+
             					'Отмена'+
             				'</button>'+
             				'<button :disabled="iri.length == 0" class="modal-default-button" @click="' + okClick + '">'+
             					'Создать'+
             				'</button>'+

             				'<br/>'+
             			'</div>'+
             		'</div>'+
             	'</div>'+
             '</transition>'
});