https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyAQEVqmLXj0haN0ZIQZS2ZcLsprVpEkg6M&location=-33.8670522,151.1957362&radius=500&types=cafe



            lat = 90 - (Math.acos(y / r)) * 180 / Math.PI;
            lon = ((270 + (Math.atan2(x, z)) * 180 / Math.PI) % 360) - 180;

            lat = Math.round(lat * 100000) / 100000;
            lon = Math.round(lon * 100000) / 100000;
            window.location.href = 'gmaps?lat='+lat+'&lon='+lon;