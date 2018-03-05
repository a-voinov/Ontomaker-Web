var closeClick = "$emit('close')";
// register modal component
Vue.component('modal', {
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

             				'<button class="modal-default-button" @click="' + closeClick + '">'+
             					'OK'+
             				'</button>'+
             				'<br/>'+
             			'</div>'+
             		'</div>'+
             	'</div>'+
             '</transition>'
});