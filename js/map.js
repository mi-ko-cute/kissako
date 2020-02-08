let map;

// htmlが読みこまれてからinitMapを実行
window.onload = function () {
    initMap();
};

function initMap() {
    const target = document.getElementById('gmap');
    const lat = parseFloat(document.getElementById('lat').textContent);
    const lng = parseFloat(document.getElementById('lng').textContent);
    const center = new google.maps.LatLng(lat, lng);
    const zoom = parseFloat(document.getElementById('zoom').textContent);
    const shopList = document.getElementById('shoplist');

    //マップを生成して表示
    map = new google.maps.Map(target, {
        center: center,
        zoom: zoom
    });
    //情報ウィンドウのインスタンスの生成
    let infoWindow = new google.maps.InfoWindow();

    // PlaceService のインスタンスの生成(引数に map を指定)
    let service = new google.maps.places.PlacesService(map);

    if (!navigator.geolocation) {
        //情報ウィンドウの位置をマップの中心位置に指定
        infowindow.setPosition(map.getCenter());
        //情報ウィンドウのコンテンツを設定
        infowindow.setContent('Geolocation に対応していません。');
        //情報ウィンドウを表示
        infowindow.open(map);
    }

    //ブラウザが対応している場合、position にユーザーの位置情報が入る
    navigator.geolocation.getCurrentPosition(function (position) {
        //position から緯度経度（ユーザーの位置）のオブジェクトを作成し変数に代入
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        //マップの中心位置を指定
        map.setCenter(pos);

        // 種類(タイプ)やキーワードをもとに施設を検索(プレイス検索)するメソッドnearbySearch()
        service.nearbySearch({
            location: pos,
            radius: 500, //検索する半径
            type: 'cafe' // タイプで検索。文字列またはその配列で指定
        }, callback);

        function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (let i = 0; i < results.length; i++) {
                    const request = {
                        placeId: results[i].place_id,
                        fields: ['name', 'photos', 'geometry', 'opening_hours', 'formatted_phone_number', 'website']
                    };
                    service.getDetails(request, function (place, stauts) {
                        if (stauts === google.maps.places.PlacesServiceStatus.OK) {
                            createMarker(place);
                            createTableShopList(place);
                        }
                    });
                }
            }
        }

        // マーカーを生成する関数
        function createMarker(place) {
            let marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
                icon: {
                    url: 'https://maps.google.com/mapfiles/ms/micons/red-dot.png',
                    labelOrigin: new google.maps.Point(0, -10)
                },
                label: {
                    color: 'red',
                    text: place.name,
                    fontSize: '17',
                    fontWeight: 'bold',
                    fontfamily: 'Avenir'
                },
                animation: google.maps.Animation.DROP
            });

            // infoWindowにお店の情報を載せるためにhtmlを生成する
            const cafe_info = document.createElement('div');
            cafe_info.classList.add('cafe_info');

            // カフェの画像を挿入
            if (place.photos !== undefined) {
                const cafe_img = document.createElement('img');
                cafe_img.setAttribute('src', place.photos[0].getUrl());
                cafe_info.appendChild(cafe_img);
            }

            // カフェの名前を挿入
            const cafe_name = document.createElement('p');
            cafe_name.textContent = place.name;
            cafe_info.appendChild(cafe_name);

            marker.addListener('click', function () {
                infoWindow.setContent(cafe_info);
                infoWindow.open(map, this);
            })
        }

        // テーブル(ショップリスト)を作成する関数
        function createTableShopList(shop) {

            const tbodyTrDOM = document.createElement('tr');
            tbodyTrDOM.innerHTML = `<td>${shop.name}</td>`; // 店名
            // 営業時間
            if (shop.opening_hours === undefined) {
                tbodyTrDOM.innerHTML += `<td></td>`;
            } else {
                tbodyTrDOM.innerHTML += `<td>${shop.opening_hours.weekday_text[0]}</td>`;
            }
            // 電話番号
            if (shop.formatted_phone_number === undefined) {
                tbodyTrDOM.innerHTML += `<td></td>`;
            } else {
                tbodyTrDOM.innerHTML += `<td>${shop.formatted_phone_number}</td>`;
            }
            // WebSite
            if (shop.website === undefined) {
                tbodyTrDOM.innerHTML += `<td></td>`;
            } else {
                tbodyTrDOM.innerHTML += `<td>${shop.website}</td>`;
            }
            tbodyTrDOM.innerHTML += `<td>混んでいません</td>`;　// 混み具合（後で実装)

            shopList.appendChild(tbodyTrDOM);
        }
    });
}
