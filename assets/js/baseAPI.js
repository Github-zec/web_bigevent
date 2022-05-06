//每次调用$.get()或$.post()或$.ajax()的时候，会调用ajaxPrefilter这个函数，在这个函数中可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(option){
    //发起真正的ajax请求之前统一拼接请求的根路径
    option.url = 'http://www.liulongbin.top:3007' + option.url;
})