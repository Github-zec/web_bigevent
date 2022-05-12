$(function(){
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    //定义补零函数
    function padZero(n){
        return n > 10 ? n : '0' + n;
    }
    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date){
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth()+1);
        var day = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss =padZero(dt.getSeconds());
        return y+'-'+m+'-'+day+' '+hh+':'+mm+':'+ss;
    }

    //定义一个查询对象，将来请求数据的时候，需要将请求参数对象发送到服务器
    var q = {
        pagenum:1, //页码值，默认为1
        pagesize:2, //每页显示多少条数据，默认为2
        cate_id:'', //文章的Id
        state:'' //文章发布状态，默认为空
    }

    initTable();
    initCate();

    //获取文章列表数据的方法
    function initTable(){
        $.ajax({
            method:'GET',
            url:'/my/article/list',
            data:q,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取文章列表失败！')
                }
                //使用模板引擎渲染列表
                var htmlstr = template('tpl-tab',res);
                $('tbody').html(htmlstr)
                renderPage(res.total)
            }
        })
    }
    
    // 初始化文章类别的方法
    function initCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg("获取分类数据失败")
                }
                
                //调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate',res);
                $('[name=cate_id]').html(htmlStr)
                //通过layui重新渲染表单区域的数据结构
                form.render()
            }
        })
    }

    //筛选功能
    $('#formSizer').on('submit',function(e){
        e.preventDefault()
        //为查询对象q中对应的属性赋值
        q.cate_id = $('[name=cate_id]').val()
        q.state =  $('[name=state]').val()
        //根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    //定义渲染分页方法
    function renderPage(total){
        //调用laypage.render()方法渲染分页的结构
        laypage.render({
            elem:'pageBox', //分页容器的id
            count:total,    //总数据条数
            limit:q.pagesize,   //每页显示几条数据
            curr:q.pagenum,  //设置默认被选中的分页
            limits:[2,3,5,10],
            layout:['count','limit','prev','page','next','skip'],
            //分页发生切换的时候，触发jump回调
            //触发jump回调的方式由两种：
            //1、点击页码的时候会触发jump回调
            //2、只要调用了laypage.render()方法，就会触发jump回调
            jump:function(obj,first){
                //可以通过first的值，来判断时通过哪种方式触发的jump回调
                //如果first的值为true，证明时方式2触发的
                //否则是方式1触发的
                // console.log(obj.curr);
                //把最新的页码值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr;
                //把最新的条目数赋值到q这个查询对象的pagesize属性中
                q.pagesize = obj.limit;
                //根据最新的q获取对应的数据列表，并渲染表格
                // initTable()
                if(!first){
                    initTable();
                }
            }
        })
    }

    //通过代理的形式为删除按钮绑定点击事件处理函数
    $('tbody').on('click','.btn_delete',function(){
        //获取删除按钮的个数
        var len = $('.btn_delete').length
        var id = $(this).attr('data-id')
        //询问用户是否要删除
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/delete/' + id,
                success:function(res){
                    if(res.status !== 0){
                        return layer.msg('删除文章失败！');
                    }
                    layer.msg('删除文章成功！')
                    //当数据删除完成了，需要判断当前这一页中，是否还有剩余数据，如果没有数据了，则让页码值-1之后，再调用initTable函数
                    if(len === 1){
                        //如果len的值等于1,证明删除完毕之后，页面上就没有任何数据了
                        //页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable()
                }
            })
            
            layer.close(index);
        });
    })
})