//ユーザー名をクラウドから参照
function userId() {
  var currentUser = ncmb.User.getCurrentUser();
  var userName = currentUser.get("userName");
  return userName;
}

//人数表示用(現在いる人数)
function AllATrue() {
  var people = ncmb.DataStore("people");
  var now = new Date();
  now.setHours(6);
  var msec = Date.parse(now);
  var date = new Date(msec);
  var checkIn = people.inArray("checkIn", "A");
  var checkOut = people.inArray("checkOut", "A");
  people.or([checkIn, checkOut])
    .greaterThanOrEqualTo("createDate", { "__type": "Date", "iso": date.toISOString(date) })
    .limit(1000)
    .fetchAll()
    .then(function (trueResults) {
      var allCheckIn = 0;
      var allCheckOut = 0;
      for (var i = 0; i < trueResults.length; i++) {
        if (trueResults[i].checkIn == "A") {
          allCheckIn++;
        }
        else if (trueResults[i].checkOut == "A") {
          allCheckOut++;
        } else {
          console.log("error");
        }
      }
      allUser = allCheckIn - allCheckOut;
      document.getElementById('AUser').innerHTML = "A";
      document.getElementById('AUser2').innerHTML = allUser;
      document.getElementById('AUser3').innerHTML = "人";
    })
    .catch(function (err) {
      console.log(err);
    });
}

function AllBTrue() {
  var people = ncmb.DataStore("people");
  var now = new Date();
  now.setHours(6);
  var msec = Date.parse(now);
  var date = new Date(msec);
  var checkIn = people.inArray("checkIn", "B");
  var checkOut = people.inArray("checkOut", "B");
  people.or([checkIn, checkOut])
    .greaterThanOrEqualTo("createDate", { "__type": "Date", "iso": date.toISOString(date) })
    .limit(1000)
    .fetchAll()
    .then(function (trueResults) {
      var allCheckIn = 0;
      var allCheckOut = 0;
      for (var i = 0; i < trueResults.length; i++) {
        if (trueResults[i].checkIn == "B") {
          allCheckIn++;
        }
        else if (trueResults[i].checkOut == "B") {
          allCheckOut++;
        } else {
          console.log("error");
        }
      }
      allUser = allCheckIn - allCheckOut;
      document.getElementById('BUser').innerHTML = "B";
      document.getElementById('BUser2').innerHTML = allUser
      document.getElementById('BUser3').innerHTML = "人";
    })
    .catch(function (err) {
      console.log(err);
    });
}

//人数表示用(過去30分)
/*
function AllATrue() {
  var people = ncmb.DataStore("people");
  var now = new Date();
  var msec = Date.parse(now);
  msec -= 1800000;
  var date = new Date(msec);
  people.inArray("checkIn", "A")
    .greaterThanOrEqualTo("createDate", { "__type": "Date", "iso": date.toISOString(date) })
    .count()
    .fetchAll()
    .then(function (trueResults) {
      document.getElementById('AUser').innerHTML = "過去30分のAのチェックイン人数は" + trueResults.count + "人です。"
    })
    .catch(function (err) {
      console.log(err);
    });
}
*/

//履歴表示用
function myHistory() {
  var people = ncmb.DataStore("people");
  people.equalTo("userName", userId())
    .order("createDate", true)
    .limit(50)
    .fetchAll()
    .then(function (results) {
      var table = document.getElementById("table1");
      table.innerHTML = '<tr><th>場所</th><th>時間</th><th>入退室</th></tr>';
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        var msec = Date.parse(object.get("createDate"));
        var date = new Date(msec);
        var updateTime = date.toLocaleString("ja-JP", { hour12: true });
        if (object.checkIn != undefined) {
          table.innerHTML += '<tr><td>' + object.checkIn + '</td><td>' + updateTime + '</td><td>' + "入室" + '</td></tr>';
        }
        else if (object.checkOut != undefined) {
          table.innerHTML += '<tr><td>' + object.checkOut + '</td><td>' + updateTime + '</td><td>' + "退室" + '</td></tr>';
        }
        else {
          console.log("error!");
        }
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}

//最後にチェックインした場所を表示
function lastCheckIn() {
  AllTrue();
  var people = ncmb.DataStore("people");
  people.equalTo("userName", userId())
    .order("createDate", true)
    .notInArray("checkIn", undefined)
    .fetchAll()
    .then(function (results) {
      var object = results[0];
      var test = object.get("checkIn");
      if (test == "A") {
        document.getElementById('test_in').innerHTML = test + 'に<br>チェックインしたよ！<br>現在の人数は' + document.getElementById('AUser2').innerHTML + '人だよ';
      } else if (test == "B") {
        document.getElementById('test_in').innerHTML = test + 'に<br>チェックインしたよ！<br>現在の人数は' + document.getElementById('BUser2').innerHTML + '人だよ';
      } else if (test == "C") {
        document.getElementById('test_in').innerHTML = test + 'に<br>チェックインしたよ！<br>現在の人数は' + document.getElementById('BUser2').innerHTML + '人だよ';
      } else {
        console.log("error!");
      }

    })
    .catch(function (err) {
      console.log(err);
    });
}

//最後にチェックアウトした場所を表示
function lastCheckOut() {
    AllTrue();
  var people = ncmb.DataStore("people");
  people.equalTo("userName", userId())
    .order("createDate", true)
    .notInArray("checkOut", undefined)
    .fetchAll()
    .then(function (results) {
      var object = results[0];
      var test = object.get("checkOut");
      if (test == "A") {
        document.getElementById('test_in').innerHTML = test + 'から<br>チェックアウトしたよ！<br>現在の人数は' + document.getElementById('AUser2').innerHTML + '人だよ';
      } else if (test == "B") {
        document.getElementById('test_in').innerHTML = test + 'から<br>チェックアウトしたよ！<br>現在の人数は' + document.getElementById('BUser2').innerHTML + '人だよ';
      } else if (test == "C") {
        document.getElementById('test_in').innerHTML = test + 'から<br>チェックアウトしたよ！<br>現在の人数は' + document.getElementById('BUser2').innerHTML + '人だよ';
      } else {
        console.log("error!");
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}

//メニュー画面での表示用
function returnLastCheckIn() {
  return document.getElementById('test_in').innerHTML;
}


function onDeviceReady() {
  var delegate = new cordova.plugins.locationManager.Delegate();

  //bluetoothをonに
  function onConfirm(buttonIndex) {
    if (buttonIndex == 2) {
      cordova.plugins.locationManager.enableBluetooth();
    }
  }

  function success(status) {
    if (!status.hasPermission) error();
  }
  var id = 0;
  cordova.plugins.locationManager.isBluetoothEnabled()
    .then(function (isEnabled) {
      console.log("isEnabled: " + isEnabled);
      if (isEnabled) {
        console.log("bluetooth is on!");
      } else {
        navigator.notification.confirm(
          'Bluetoothの使用を許可しますか？', // message
          onConfirm,            // callback to invoke with index of button pressed
          'このアプリケーションはBluetoothを使用します。',           // title
          ['許可しない', '許可する']     // buttonLabels
        );
      }
    })
    .fail(function (e) { console.error(e); })
    .done();
}

function AllTrue() {
  AllATrue();
  AllBTrue();
}

function sendForm() {

  var comment = $("#form_comment").val();         //内容
  //入力規則およびデータをフィールドにセットする
  if (comment == "") {
    alert("不具合内容が入力されていません");
  } else {
    //mBaaSに保存先クラスの作成
    var Form = ncmb.DataStore("Form");

    //インスタンスの生成
    var form = new Form();

    //インスタンスにデータをセットする
    form.set("comment", comment)
      .save()
      .then(function (results) {
        //保存に成功した場合の処理
        alert("報告を受け付けました。ありがとうございます。");
        location.reload();
      })
      .catch(function (error) {
        //保存に失敗した場合の処理
        alert("受け付けできませんでした：\n" + error);
        console.log("受け付けできませんでした：\n" + error);
      });
  }
}

document.addEventListener('deviceready', onDeviceReady, false);