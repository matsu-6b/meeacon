//NCMBのオブジェクトクラス定義
var appKey = "";
var clientKey = "";
var ncmb = new NCMB(appKey, clientKey);

//ユーザー名をクラウドから参照
function userId() {
  var currentUser = ncmb.User.getCurrentUser();
  var userName = currentUser.get("userName");
  return userName;
}

//データストアの変数宣言
var people = ncmb.DataStore("people");

//delegateの作成と設定
function onDeviceReady() {
//バックグラウンドで実行
cordova.plugins.backgroundMode.enable();
cordova.plugins.backgroundMode.setDefaults({ silent: true });

  //delegateの作成
  var delegate = new cordova.plugins.locationManager.Delegate();
  delegate.didDetermineStateForRegion = function (pluginResult) {
    //    console.log('Determine', pluginResult);
  }
  delegate.didStartMonitoringForRegion = function (pluginResult) {
    //    console.log('StartMonitoring', pluginResult);
  }
  delegate.didRangeBeaconsInRegion = function (pluginResult) {
    //   document.getElementById("log").value = JSON.stringify(pluginResult);
  }


  //チェックイン
  delegate.didEnterRegion = function (pluginResult) {
    var ATrue = new people();
    ATrue.set("checkIn", pluginResult.region.identifier)
      .set("userName", userId())
      .save()
      .then(function () {
        cordova.plugins.notification.local.schedule({
          title: 'チェックインしました',
          text: pluginResult.region.identifier + 'へようこそ！',
          actions: [
            { id: 'yes', title: '共有する(未実装)' },
            { id: 'no', title: '共有しない' }
          ]
        });
        lastCheckIn();
      })
      .catch(function (err) {
        // エラー処理
        cordova.plugins.notification.local.schedule({
          title: "error",
          text: "エラーです"
        });
      })
  }

  cordova.plugins.notification.local.on("click", function (notification) {
    if (notification.id == yes) {
      window.plugins.socialsharing.share(returnLastCheckIn() + ' #meeacon');
    }
  });

  //チェックアウト
  delegate.didExitRegion = function (pluginResult) {
    var AFalse = new people();
    AFalse.set("checkOut", pluginResult.region.identifier)
      .set("userName", userId())
      .save()
      .then(function () {
        cordova.plugins.notification.local.schedule({
          title: "チェックアウトしました",
          text: pluginResult.region.identifier + "から退出しました",
          actions: [
            { id: 'yes', title: '共有する(未実装)' },
            { id: 'no', title: '共有しない' }
          ]
        });
        lastCheckOut();
      })
      .catch(function (err) {
        // エラー処理
        cordova.plugins.notification.local.schedule({
          title: "error",
          text: "エラーです"
        });
      })
  }

  cordova.plugins.locationManager.setDelegate(delegate);

  //監視するビーコンの作成
  var Beacons = [
    {
      uuid: '',
      identifier: 'A'
    },
    {
      uuid: '',
      identifier: 'B'
    },
     {
       uuid: '',
       identifier: 'C',
     }
  ];

  var BeaconRegions = [];

  //ビーコンの監視
  for (var i in Beacons) {
    var b = Beacons[i];
    BeaconRegions[b.identifier] = new cordova.plugins.locationManager.BeaconRegion(b.identifier, b.uuid);
    BeaconRegions[b.identifier].notifyEntryStateOnDisplay = true;
    cordova.plugins.locationManager.startMonitoringForRegion(BeaconRegions[b.identifier])
      .fail(function (e) { console.error(e); })
      .done();
  }
}

document.addEventListener('deviceready', onDeviceReady, false);