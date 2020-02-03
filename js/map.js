let map;


function initMap() {
    let target = document.getElementById('gmap');
    let lat = parseFloat(document.getElementById('lat').textContent);
    let lng = parseFloat(document.getElementById('lng').textContent);
    let center = new google.maps.LatLng(lat, lng);
    let zoom = parseFloat(document.getElementById('zoom').textContent)

    //マップを生成して表示
    map = new google.maps.Map(target, {
        center: center,
        zoom: zoom
    });
    //情報ウィンドウのインスタンスの生成
    let infoWindow = new google.maps.InfoWindow();

    // PlaceService のインスタンスの生成(引数に map を指定)
    let service = new google.maps.places.PlacesService(map);

    // 種類(タイプ)やキーワードをもとに施設を検索(プレイス検索)するメソッドnearbySearch()
    service.nearbySearch({
        location: center,
        radius: 500, //検索する半径
        type: 'cafe' // タイプで検索。文字列またはその配列で指定
    }, callback);

    function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (let i = 0; i < results.length; i++) {
                createMarker(results[i]);
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
        const cafe_img = document.createElement('img');
        cafe_img.setAttribute('src', place.photos[0].getUrl());
        cafe_info.appendChild(cafe_img);

        // カフェの名前を挿入
        const cafe_name = document.createElement('p');
        cafe_name.textContent = place.name;
        cafe_info.appendChild(cafe_name);

        marker.addListener('click', function () {
            infoWindow.setContent(cafe_info);
            infoWindow.open(map, this);
        })
    }
}

// HTMLの読み込みが終了してから、Initmap関数の実行をする
google.maps.event.addDomListener(window, 'load', initMap());