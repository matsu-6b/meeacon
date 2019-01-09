// [NCMB] APIキー設定
var appKey = "a275310cbfe8315651466c298f2019704dc876778467f8dc55556c7e151001a8";
var clientKey = "5b99ee1f0e78923cbf2031dd18b273d912962e6b3fbea6f164eb59f65c331b0b";

// [NCMB] SDKの初期化
var ncmb = new NCMB(appKey, clientKey);

var flag = false;
var id_flag = false;
// ログイン中の会員
var currentLoginUser;


/********** ID / PW 認証 **********/
// 【ID / PW 認証】「登録する」ボタン押下時の処理
function onIDRegisterBtn() {
  // 入力フォームからID(username)とPW(password)を取得
  var username = $("#reg_username").val(); //id


  var password = $("#IDReg_password").val(); //パスワード

  
  var regex_id = new RegExp(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
  var regex_pw = new RegExp(/^[a-z\d]{8,100}$/i);
  //判定
  if (regex_id.test(username)) {
    if (regex_pw.test(password)) {
      id_flag = true;
    } else {
      alert("パスワードを正しく表記してください");
    }
  } else if (regex_pw.test(password)) {
    alert("メールアドレスを正しく入力してください");
  } else {
    alert("メールアドレスとパスワードを正しく入力してください")
  }

  //学部
  var Department = document.getElementsByName("department");
  for (var a = "", i = Department.length; i--;) {
    if (Department[i].selected) {
      var a = Department[i].value;
      break;
    }
  }
  Department = a;

  //性別

  var Sex = document.getElementsByName("Sex");
  for (var b = "", i = Sex.length; i--;) {
    if (Sex[i].selected) {
      var b = Sex[i].value;
      break;
    }
  }
  Sex = b;

  var Grade = document.getElementsByName("Grade");
  for (var c = "", i = Grade.length; i--;) {
    if (Grade[i].selected) {
      var c = Grade[i].value;
      break;
    }
  }
  Grade = c;
  if (id_flag == true) {
    // loading の表示
    $.mobile.loading('show');
    // [NCMB] user インスタンスの生成
    var user = new ncmb.User();
    // [NCMB] ID / PW で新規登録

    user.set("userName", username)
      .set("password", password)
      .set("Grade", Grade)
      .set("Sex", Sex)
      .set("Department", Department)
      .signUpByAccount()
      .then(function (user) {
        /* 処理成功 */
        console.log("【ID / PW 認証】新規登録に成功しました");
        // [NCMB] userインスタンスでログイン
        ncmb.User.login(user)
          .then(function (user) {
            /* 処理成功 */
            console.log("【ID / PW 認証】ログインに成功しました");

            // [NCMB] ログイン中の会員情報の取得
            currentLoginUser = ncmb.User.getCurrentUser();
            // フィールドを空に
            //$("#department").val("");
            $("#reg_username").val("");
            $("#IDReg_password").val("");
            // 詳細ページへ移動
            $.mobile.changePage('#menu');
          })
          .catch(function (error) {
            /* 処理失敗 */
            console.log("【ID / PW 認証】ログインに失敗しました: " + error);
            alert("【ID / PW 認証】ログインに失敗しました: " + error);
            // フィールドを空に
            //$("#department").val("");
            $("#reg_username").val("");
            $("#IDReg_password").val("");
            // loading の表示
            $.mobile.loading('hide');
          });
      })
      .catch(function (error) {

        /* 処理失敗 */
        console.log("【ID / PW 認証】新規登録に失敗しました：" + error);
        alert("【ID / PW 認証】新規登録に失敗しました：" + error);
        // フィールドを空に
        //$("#department").val("");
        $("#mailAddress").val("");
        $("#IDReg_password").val("");
        // loading の表示
        $.mobile.loading('hide');
      });
  }
}

// 【ID / PW 認証】「ログインする」ボタン押下時の処理
function onIDLoginBtn() {
  // 入力フォームからID(username)とPW(password)を取得
  var username = $("#login_username").val();
  var password = $("#IDLogin_password").val();

  // loading の表示
  $.mobile.loading('show');

  // [NCMB] ID / PW でログイン
  ncmb.User.login(username, password)
    .then(function (user) {
      // 処理成功 
      console.log("【ID / PW 認証】ログインに成功しました");
      // [NCMB] ログイン中の会員情報の取得
      currentLoginUser = ncmb.User.getCurrentUser();
      // フィールドを空に
      $("#login_username").val("");
      $("#IDLogin_password").val("");
      // 詳細ページへ移動
      $.mobile.changePage('#menu');
    })
    .catch(function (error) {
      // 処理失敗 
      console.log("【ID / PW 認証】ログインに失敗しました: " + error);
      alert("【ID / PW 認証】ログインに失敗しました: " + error);
      // フィールドを空に
      $("#login_username").val("");
      $("#IDLogin_password").val("");
      // loading の表示終了
      $.mobile.loading('hide');
    });
}

/********** 共通 **********/
// 「ログアウト」ボタン押下後確認アラートで「はい」押下時の処理
function onLogoutBtn() {
  // [NCMB] ログアウト
  flag = false;
  ncmb.User.logout();
  console.log("ログアウトに成功しました");
  // ログイン中の会員情報を空に
  currentLoginUser = null;
  // currentUserDataリストを空に
  $("#currentUserData").empty();
  // 【ID / PW】ログインページへ移動
  $.mobile.changePage('#IDLoginPage');
}
function onDeleteBtn() {
  // [NCMB] アカウント削除
  var user = ncmb.User.getCurrentUser();
  user.delete();
  ncmb.User.logout()
    .then(function (data) {
      console.log("アカウント削除に成功しました");
      // ログイン中の会員情報を空に
      currentLoginUser = null;
      // currentUserDataリストを空に
      $("#currentUserData").empty();
      // 【ID / PW】ログインページへ移動
      $.mobile.changePage('#IDLoginPage');
    })
    .catch(function (err) {
      // エラー処理
      console.log(err);
    });
}

// アプリ起動時
$(function () {
  $.mobile.defaultPageTransition = 'none';
  /* ID / PW */
  $("#IDLoginBtn").click(onIDLoginBtn);
  $("#IDRegisterBtn").click(onIDRegisterBtn);

  /* 共通 */
  $("#YesBtn_logout").click(onLogoutBtn);
  currentLoginUser = ncmb.User.getCurrentUser();
  if (currentLoginUser != null) {
    $.mobile.changePage('#menu');
  }
  else {

  }

  $("#YesBtn_delete").click(onDeleteBtn);
  currentLoginUser = ncmb.User.getCurrentUser();
  if (currentLoginUser != null) {
    $.mobile.changePage('#menu');
  }
  else {

  }

});

// loading 表示生成
$(document).on('mobileinit', function () {
  $.mobile.loader.prototype.options;
});

// DetailPage ページが表示されるたびに実行される処理
$(document).on('pageshow', '#DetailPage', function (e, d) {
  // currentUserData を表示
  getUserData();
  // loading の表示を終了
  $.mobile.loading('hide');

});

// currentUser のデータを表示する処理
function getUserData() {
  // 値を取得
  var objectId = currentLoginUser.get("objectId");
  var Sex = currentLoginUser.get("Sex");
  var userName = currentLoginUser.get("userName");
  var Grade = currentLoginUser.get("Grade");
  var Department = currentLoginUser.get("Department");
  var date = new Date(currentLoginUser.get("createDate"));

  //時刻表示
  function nowTime() {
    var msec = Date.parse(date);
    var x = new Date(msec);
    var updateTime = x.toLocaleString("ja-JP", { hour12: true });
    return updateTime;
  }
  // リストに追加
  if (flag == false) {
    $("#currentUserData").append("<tr style='border-right: 1px solid #ccc; border-left: 1px solid #ccc; color: #FFFFFF; background: #04162e;'><th scope='row' id='key'>key</th><td scope='row' id='value' style='width: 100%;'>value</td></tr>");
    $("#currentUserData").append("<tr><th>性別</th><td><input type='text' style='width: 95%; color: #959595;' readonly='readonly'; value='" + Sex + "'/></tr>");
    $("#currentUserData").append("<tr><th>アドレス</th><td><input type='text' style='width: 95%; color: #959595;' readonly='readonly'; value='" + userName + "'/></tr>");
    $("#currentUserData").append("<tr><th>学部</th><td><input type='text' style='width: 95%; color: #959595;' readonly='readonly'; value='" + Department + "'/></tr>");
    $("#currentUserData").append("<tr><th>学年</th><td><input type='text' style='width: 95%; color: #959595;' readonly='readonly'; value='" + Grade + "'/></tr>");
    $("#currentUserData").append("<tr><th>createDate</th><td><input type='text' style='width: 95%; color: #959595;' readonly='readonly'; value='" + nowTime() + "'/></tr>");
    // リストを更新
    $("#currentUserData").listview('refresh');
    flag = true;
  }

}

function onDeleteField() {
  // フィールドを空に
  $("#reg_mailAddress").val("");
}
