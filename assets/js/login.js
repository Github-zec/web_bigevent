$(function(){
    $('#link_reg').on('click',function(){
        
        $('.login-box').hide();
        $('.reg-box').show();
    })
    $('#link_login').on('click',function(){
        $('.login-box').show();
        $('.reg-box').hide();
    })

    // 从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;
    // 同过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个pwd的规则
        pwd:[/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],
        repwd:function(value){
            var pwd = $('.reg-box input[name=password]').val();
            if(value !== pwd){
                return '两次密码不一致';
            }
        }
    })


    // 监听注册表单的提交事件
    $('#form_reg').on('submit',function(e){
        //阻止默认提交行为
        e.preventDefault();
        //发起ajax请求
        var data = {username:$('.reg-box [name=username]').val(),password:$('.reg-box [name=password]').val()}
        $.post('/api/reguser',data,function(res){
            if(res.status !== 0){
                return layer.msg(res.message);;
            }
            layer.msg('注册成功请登录');
            $('#link_login').click();

        })
    })

    //监听登录表单的提交行为
    $('#form_login').on('submit',function(e){
        e.preventDefault();
        var data = $(this).serialize();
        $.ajax({
            method:'POST',
            url:'/api/login',
            data:data,
            success:function(res){
                console.log(res);
                if(res.status !== 0){
                    return layer.msg('登陆失败')
                }
                layer.msg('登录成功')
                //将登录成功得到得token字符串保存到localStorage中
                localStorage.setItem('token',res.token)
                //跳转到主页
                location.href='/index.html'
            }
        })            
    })
})