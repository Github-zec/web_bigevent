$(function () {
  var form = layui.form;
  var layer = layui.layer;
  //获取文章类别
  function atrReset() {
    $.ajax({
      mechod: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章类别失败！");
        }
        var data = res.data.slice(0, 9);
        var atcList = template("temp", data);
        $("tbody").html(atcList);
      },
    });
  }
  atrReset();

  //添加文章类别按钮绑定点击事件
  var indexAdd = null;
  $('#btnAdd').on('click',function(){
      indexAdd = layer.open({
      type: 1,
      area:['500px','250px'],
      title:'添加文章类别', 
      content: $('#dialogAdd').html() //这里content是一个普通的String
    });

    //通过代理的形式为form-add表单绑定submit事件
    $('body').on('submit','#form-add',function(e){
      e.preventDefault();
      $.ajax({
        method:"POST",
        url:'/my/article/addcates',
        data:$(this).serialize(),
        success:function(res){
          if(res.status !== 0){
            return layer.msg('添加文章类别失败')
          }
          atrReset()
          layer.close(indexAdd)
        }
      })
    })
  })

  

  //绑定编辑事件
  var indexEdit = null;  
  $("tbody").on("click", "#btnEdit", function () {
    indexEdit = layer.open({
      type: 1,
      area:['500px','300px'],
      title:'修改文章类别',
      content: $('#atcEidt').html()//这里content是一个普通的String
    });

    //根据id获取文章类别
    var id = $(this).attr('data-Id')
    $.ajax({
      method:'GET',
      url:'/my/article/cates/'+id,
      success:function(res){
        if(res.status !== 0){
          return layer.msg('获取文章类别失败')
        }
        form.val('formEdit',res.data)
      }
    })
  });

  $('body').on('submit','#form-edit',function(e){
    var id = $(this).attr('data-Id')
    e.preventDefault();
    $.ajax({
      method:"POST",
      url:'/my/article/updatecate',
      data:$(this).serialize(),
      success:function(res){
        if(res.status !== 0){
          return layer.msg('更新文章分类失败')
        }
        layer.msg('更新分类数据成功')
        layer.close(indexEdit)
        atrReset()       
      }
    })
  })


  //通过代理的形式，根据id绑定删除事件
  $("tbody").on("click", "#btnDel", function () {
    var id = $(this).attr('data-id');
    //提示用户是否删除
    layer.confirm('确认删除?', {icon: 3, title:'是否删除？'}, function(index){
      $.ajax({
        method:'GET',
        url:'/my/article/deletecate/' + id,
        success:function(res){
          if(res.status !== 0){
            return layer.msg('删除分类失败')
          }
          layer.msg('删除分类成功！')
          layer.close(index);
          atrReset();
        }
      })      
    });
  });
});
