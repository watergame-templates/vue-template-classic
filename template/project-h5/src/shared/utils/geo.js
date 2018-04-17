/**
 * 获取位置信息
 */
export function getLocation() {
    return new Promise((resolve, reject) => {
      // 百度地图API功能
      var map = new BMap.Map(allmap);
      var point = new BMap.Point(116.331398, 39.897445);
      map.centerAndZoom(point, 12);
  
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          var mk = new BMap.Marker(r.point);
          map.addOverlay(mk);
          map.panTo(r.point);
          resolve(r);
        } else {
          reject('failed' + this.getStatus());
        }
      }, {
        enableHighAccuracy: true
      })
    });
  }
  