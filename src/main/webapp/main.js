var app = new Vue({
	el: '#app',
	data: {
		convertButtonText:'КЕЯ -> OWL',
		downloadOWLButtonText: 'Скачать OWL',
		cnl: '',
		owl: '',
		serviceLink: '/Owl'
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
		}
	}
})