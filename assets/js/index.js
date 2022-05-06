$(function () {
  //调用getUserInfo获取用户基本信息
  getUserInfo();

  $("#btnLogout").on("click", function (e) {
    //提示用户是否退出
    layer.confirm(
      "确定退出登录?",
      { icon: 3, title: "提示" },
      function (index) {
        //清除token
        localStorage.removeItem("token");
        //跳转到登陆页面
        location.href = "/login.html";
        layer.close(index);
      }
    );
  });
});

//获取用户的基本信息
function getUserInfo() {
  $.ajax({
    method: "GET",
    url: "/my/userinfo",
    //headers就是请求头配置对象
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg("获取用户信息失败");
      }
      randerAvatar(res.data);
    }
    //不论成功还是失败都会调用complete函数    
  });
}

function randerAvatar(user) {
  var name = user.nickname || user.username;
  $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
  //渲染图片头像
  if (user.user_pic) {
    $(".layui-nav-img").attr("src", user.user_pic);
    $(".text-avatar").hide();
  } else {
    //渲染文本头像
    $(".layui-nav-img").hide();
    $(".text-avatar").html(name[0].toUpperCase());
  }
}
