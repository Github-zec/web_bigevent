//每次调用$.get()或$.post()或$.ajax()的时候，会先调用ajaxPrefilter这个函数，在这个函数中可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(option){
    //发起真正的ajax请求之前统一拼接请求的根路径
    option.url = 'http://www.liulongbin.top:3007' + option.url;

    //统一为有权限的接口设置headers 请求头
    if(option.url.includes('/my/')){
        option.headers = {
            Authorization:localStorage.getItem('token') || ''
        }
    }  
    option.complete = function(res){
        //在complete回调函数中，可以使用res.responseJSON拿到服务器相应回来的数据
        //强制清空token
        //强制跳转到登陆页面
        if(res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！"){
            localStorage.removeItem('token') 
            location.href = '/login.html';      
        }      
    }
})