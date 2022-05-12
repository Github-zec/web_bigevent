$(function(){
    var layer = layui.layer;
    var form = layui.form;
    initCate()
    initEditor()
    //定义记载文章分类的方法
    function initCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('请求文章类别失败')
                }
                var htmlstr = template('tplCate',res)
                $('[name=cate_id]').html(htmlstr)
                //一定记得调用form.render函数渲染分类
                form.render()
            }
        })
    }

    //图片剪裁
    // 1. 初始化图片裁剪器
    var $image = $('#image')
    
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }   
    // 3. 初始化裁剪区域
    $image.cropper(options)
    //绑定点击事件
    $('#btnChooseImage').on('click',function(){
        $('#coverFile').click();
    })

    //监听coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').on('change',function(e){
        //判断用户是否选择了文件
        if(files.length === 0){
            return layer.msg('请选择文件');
        }
        var file = e.target.files[0];
        //根据文件，创建对应的url地址
        var newImgURL = URL.createObjectURL(file);
        $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域

    })

    //定义文章的发布状态
    var art_state = '已发布';

    //为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click',function(){
        art_state = '草稿';
    })

    $('#formPub').on('submit',function(e){
        e.preventDefault();
        //基于form表单，快速创建一个FormData对象
        var fd = new FormData($(this)[0]);
        //将文章的发布状态，存到fd中
        fd.append('state',art_state)

        //将封面裁剪过后的图片，输出为一个文件对象
        $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            fd.append('cover_img',blob)
            //发起ajax数据请求
            publishArtical(fd)
        })
    })

    //定义一个发布文章的方法
    function publishArtical(fd){
        $.ajax({
            method:'POST',
            url:'/my/article/add',
            data:fd,
            //注意：如果向服务器提交的是FormData格式的数据，
            //必须添加以下两个配置项
            contentType:false,
            processData:false,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                location.href = '../../artical/art_list.html'
            }
        })
    }
})
