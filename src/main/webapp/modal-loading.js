var closeClick = "$emit('close')";
// register modal component
Vue.component('modal-loading', {
  template: '<transition name="modal">'+
             	'<div class="modal-mask">'+
             		'<div class="modal-wrapper">'+
             			'<div class="modal-container">'+

             				'<div class="modal-header">'+
             					'<slot name="header">'+
             						'OWL создается...'+
             					'</slot>'+
             				'</div>'+

             				'<div style="text-align:center" class="modal-body">'+
             					'<i style="font-size:48px" class="el-icon-loading"></i>' +
             				'</div>'+

             			'</div>'+
             		'</div>'+
             	'</div>'+
             '</transition>'
});