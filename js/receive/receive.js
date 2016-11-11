'use.strict';

/*新建发货单*/
app.controller("receiveNew", ['$scope', '$state', '$interval','$http','baseHttp',function($scope, $state, $interval,$http,baseHttp) {
    /*弹出框显示*/
    var routeId=0;
    var ClientKey=$("#ClientKey").val();
    $scope.moldbox=false;
    $scope.mold=function(){
        if(!$scope.moldbox){
            $scope.moldbox=true;
            $("#mold").css("display","block");
        }else{
           $scope.moldbox=false; 
        }
    }
    var molds=$("#mold ul li");
    for(var k=0; k<molds.length; k++){
        molds[k].onclick = (function(num){
            return function(){
                $("#userMold").val(this.getAttribute("infinityname"))               
                $("#moldid").val(this.getAttribute("infinityid"))
                console.log($("#moldid").val())
                 $scope.moldbox=false; 
                $("#mold").css("display","none");
            };
            
        })(k);
    }
    $scope.receive = false;
    $scope.conbool = function() {
        if(!$scope.receive){
            $scope.receive=true;
            $http({
            url:'http://10.129.83.20:8080/client/getClientKey',
            method:"POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {

            }
            }).success(function(data){
            console.log(data);
            if(data.result){
                ClientKey=$("#ClientKey").val(data.data);
            }
            });
        }else{
             $scope.receive = false;
        }
        /*省市县三级联动*/
        $scope.s_province="省份";
        $scope.s_city="市";
        $scope.s_county="县区";
        $http({
            url:'http://10.129.83.20:8080/area/selectArea?pid=0',
            method:"POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {

            }
            }).success(function(data){
                console.log(data);
                $scope.province=[];
                if(data.result){
                    for(var i=0;i<data.data.length;i++){
                        $scope.province.push(data.data[i]);
                    }

                }else{

                }
            })
            $("#s_province").on("change",function(){
                var pid=$("#provinceId").val();
                $http({
                    url:'http://10.129.83.20:8080/area/selectArea?pid='+pid,
                    method:"POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: {

                    }
                }).success(function(data){
                    $scope.city=[];
                    for(var i=0;i<data.data.length;i++){
                        $scope.city.push(data.data[i]);
                    }
                })

            })
            $("#s_city").on("change",function(){
                var cityid=$("#cityId").val();
                $http({
                    url:'http://10.129.83.20:8080/area/selectArea?pid='+cityid,
                    method:"POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: {

                    }
                }).success(function(data){
                    $scope.county=[];
                    for(var i=0;i<data.data.length;i++){
                        $scope.county.push(data.data[i]);
                    }
                })

            })
        /*线路查询*/
         $http({
            url:'http://10.129.83.20:8080/serviceLine/getAllServiceLine',
             method:"POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {

            }
            }).success(function(data){
            var routes=data.data;
            var lens=routes.length;
            $scope.routeserveList=[];
            for(var i=0;i<lens;i++){
                $scope.routeserveList.push(routes[i]);
            }
        });
        $scope.rsBox=false;
        $scope.rsbtn=function(){
            if(!$scope.rsBox){
                $scope.rsBox=true;
                $("#rsbox").css("display","block");
            }else{
                $scope.rsBox=false;
            }           
        }
        /*线路选中*/
        $scope.routeSerBtn=function(i){
            $("#routeService").val(i.lineName);
            $("#routeServiceId").val(i.id);
            $scope.rsBox=false;
        }
        /*开户行*/
        $scope.bankbox=false;
        $scope.wbank=function(){
            if(!$scope.bankbox){
                $scope.bankbox=true;
                $("#bankBox").css("display","block")
            }else{
                $scope.bankbox=false;
            }
        }
        var banklist=$("#bankBox ul li");
        for(var k=0; k<banklist.length; k++){
            banklist[k].onclick = (function(num){
                return function(){
                    $("#bank").val(this.getAttribute("infinityname"))               
                    $("#bankid").val(this.getAttribute("infinityid"))
                    console.log($("#bankid").val())
                     $scope.bankbox=false; 
                    $("#bankBox").css("display","none");
                };
                
            })(k);
        }
        $scope.submit=function(){
            var pclientCode=$("#ClientKey").val()||0;//客户编号
            var pclientName=$("#receivingPerson1").val();//客户名称
            var contacts=$("#contacts").val();//联系人
            var contactNumber=$("#contactNumber").val();//联系电话
            var alternativePhone1=$("#alternativePhone1").val();//备用电话1
            var alternativePhone2=$("#alternativePhone2").val();//备用电话2
            var jzProvince=$("#provinceId").val();
            var jzCity=$("#cityId").val();
            var jzCounty=$("#countyId").val();
            var jzAddress=$("#receivingAddress1").val();
            var clientType=$("#moldid").val();
            var routeId=$("#routeServiceId").val();
            var openBank=$("#bankid").val();
            var openBranch=$("#bankName").val();
            var openName=$("#bankAccountName").val();
            var bankAccount=$("#bankAccountNumber").val();
            var moneyPhone=$("#moneyPhone").val();
            console.log(jzProvince);
            var pdata={
                "clientCode":pclientCode,  //是   string  客户编号
                "clientName":pclientName, //是   string  客户名称
                "contacts":contacts,    //是   string  联系人
                "contactNumber":contactNumber,   //是   string  联系电话
                "alternativePhone1":alternativePhone1,   //是   string  备用电话1
                "alternativePhone2":alternativePhone2,   //是   string  备用电话2
                "jzProvince":jzProvince,  //是   long    居住省
                "jzCity":jzCity,  //是   long    居住市
                "jzCounty":jzCounty,    //是   long    居住县/区
                "jzAddress":jzAddress,   //是   string  居住详细地址
                "clientType":clientType,  //是   int 客户类型 1汽配店 2修理厂
                "routeId":routeId, //是   long    线路编号
                "openBank":openBank,    //是   int 开户银行
                "openBranch":openBranch,  //是   string  开户支行
                "openName":openName,    //是   string  开户名称
                "bankAccount":bankAccount,  //是   string  银行账号
                "moneyPhone":moneyPhone  //是   string  财务打款手机

            }
            $http({
                url:'http://10.129.83.20:8080/client/insertClientInfo',
                method:"POST",
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: function(obj) {
                var str = [];
                for (var p in obj) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            },

            data: pdata,
            }).success(function(data){
                console.log(data);

            })
        }
        $scope.save = function(){
            //获取到表单是否验证通过
            if ($scope.form.$valid) {
                alert('验证通过提交表单');
            } else {
                alert('表单没有通过验证');
            }
        }
    }
    $scope.cancel = function() {
            $scope.receive = false;
        }
        /*路由的选中状态*/
    $scope.$state = $state;
/*收货方数据加载*/
$scope.search=function(){
        var sev=document.getElementById("searval");
        var seval=sev.value;
        var clientCode=null;
        var clientName=null;
        var url=null;
        if(seval==""){
                alert("请输入搜索内容");
            }else if(/^\d+$/g.test(seval)){
                clientCode=seval;
                 url='http://10.129.83.20:8080/ship/getClientInfo?clientCode='+clientCode
            
            }else if(/^[\u4E00-\u9FFF]+$/g.test(seval)){
                clientName=seval;
                url='http://10.129.83.20:8080/ship/getClientInfo?clientName='+clientName
            }else{
                alert("请输入客户编号或者客户名称");
            }
    $http({
      url:url,
      method:"POST",
      headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {

        }
    }).success(function(data){
       var data=data.data;
       console.log(data);
        $scope.item=[];
        if(data.length>10){
            data=data.slice(0,10)
        }
       for(var i=0;i<data.length;i++){
          $scope.item.push(data[i]);
        }
        $scope.takeBox = true;
        $('#box1').css('display', 'block');
        $scope.takeCon = function(take){
            $scope.takeDetlis = take.clientName;
            $scope.takeBox = false;
            var onId=take.id;
            window.localStorage.setItem("receiverId",onId);  
        $http({
            url:'http://10.129.83.20:8080/ship/getClientInfoById?id='+onId,
            method:"POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {

            }
            }).success(function(data1){
                var data1=data1.data[0];
                    console.log(data1);
                    routeId=data1.routeId;
                    console.log(routeId);
                    $("#receive_person").val(data1.contacts);
                    $("#receive_telephone").val(data1.contactNumber);
                    $("#receive_address").val(data1.address);
                     $http({
                        url:'http://10.129.83.20:8080/serviceLine/getAllServiceLine',
                        method:"POST",
                        headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: {

                        }
                        }).success(function(data){
                            linedata=data.data;
                            var len=linedata.length;
                            $scope.line=[];
                            console.log(routeId);
                            for(var i=0;i<len;i++){
                                $scope.line.push(linedata[i]);                                
                                if(linedata[i].id==routeId){
                                    $scope.routeli=linedata[i].lineName;
                                    window.localStorage.setItem("routeId",routeId);
                                    console.log(routeId);
                                    rrr();
                                }
                            }
                            console.log($scope.line);
                            $scope.routeBox=false;
                            $scope.routelist=function(){
                                if(!$scope.routeBox){
                                    $scope.routeBox=true;
                                    $("#route").css('display', 'block');
                                }else{
                                    $scope.routeBox=false;
                                }
                            }
                            $scope.routeOn=function(i){
                                $scope.routeli=i.lineName;
                                routeId=i.id;
                                window.localStorage.setItem("routeId",routeId);
                                console.log(routeId);
                                $scope.routeBox=false;
                                rrr();
                            }
                            function rrr(){
                                var id=window.localStorage.getItem("routeId");
                                $http({
                                url:'http://10.129.83.20:8080/serviceLine/getLineRunsByServiceLine?id='+id,
                                method:"POST",
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                },
                                 data: {

                                }
                                }).success(function(data){
                                    var rundata=data.data;
                                    console.log(rundata)
                                    $scope.run=[];
                                    var time=[];
                                    var times=[];
                                    for(var i=0;i<rundata.length;i++){                                        
                                        
                                        time.push(rundata[i].runTime);
                                        times.push(rundata[i]);
                                        $scope.run.push(rundata[i]);
                                        
                                    }
                                    console.log(rundata);
                                    console.log(time);
                                    function dealTime(time){
                                        var time1=[];
                                        var timeM=[];
                                        var poorTime=[];
                                        for(var i=0;i<time.length;i++){
                                            time1.push(time[i].split(":"));

                                        }
                                        for(var i=0;i<time1.length;i++){
                                            timeM.push(parseInt(time1[i][0]*60)+parseInt(time1[i][1]));
                                        }                                   
                                        var newTime=dealDate();
                                        for(var i=0;i<timeM.length;i++){
                                           if(timeM[i]-newTime>=0){
                                            poorTime.push(timeM[i]);
                                           }
                                        }
                                       var _default=Math.min.apply(null, poorTime);
                                       var _hh=parseInt(_default/60);
                                       var _mm=_default%60;
                                        if(_hh<10){
                                            _hh="0"+_hh;
                                        }
                                        if(_mm<10){
                                            _mm="0"+_mm;
                                        }
                                        _defaultTime=_hh+":"+_mm;
                                        console.log(_defaultTime);
                                        if(_defaultTime=="NaN:NaN"){

                                        }else{
                                            $scope.runli=_defaultTime;
                                            for(var i=0;i<times.length;i++){
                                                if(times[i].runTime==_defaultTime){
                                                    window.localStorage.setItem("frequencyId",times[i].id);
                                                }
                                            }
                                        }
                                        

                                    }
                                    dealTime(time);
                                    
                                    $scope.runBox=false;
                                    $scope.runlist=function(){
                                        if(!$scope.runBox){
                                            $scope.runBox=true;
                                            $("#run").css('display', 'block');
                                        }else{
                                            $scope.runBox=false;
                                        }
                                    }
                                    $scope.runOn=function(i){
                                        $scope.runli=i.runTime;
                                         $scope.runBox=false;
                                         window.localStorage.setItem("frequencyId",i.id);

                                    }
                                })
                            }
                            
                        });
            });
     }       
     });   
         
  }
    window.localStorage.setItem("receivingWay",0);
    $scope.blreway=false;
    $scope.reway=function(){
    //$("#reway").css("display","block");
        if(!$scope.blreway){
            $scope.blreway=true;
            $("#reway").css("display","block");
        }else{
            $scope.blreway=false;
        }
         var lilist=$("#reway ul li");
        console.log(lilist);
        for(var k=0; k<lilist.length; k++){
        lilist[k].onclick = (function(num){
            console.log( $scope.blreway);
            return function(){
                $("#Receiving").val(this.getAttribute("infinityname"))
                console.log(this.getAttribute("infinityid"))
                window.localStorage.setItem("receivingWay",this.getAttribute("infinityid"));
                $scope.blreway=false;
                console.log( $scope.blreway);
                $("#reway").css("display","none");
                change();
            };
            
        })(k);
    }
    };
   

    function dealDate(){
        var date= new Date();
        var _h=date.getHours();
        var _m=date.getMinutes();
        var allm=_h*60+_m;
        return allm; 
    }
     dealDate();
    /*处理数据*/
   



    // $scope.item = [{
    //     id: 1,
    //     text: "one"
    // }, {
    //     id: 2,
    //     text: "two"
    // }, {
    //     id: 3,
    //     text: "three"
    // }, {
    //     id: 4,
    //     text: "four"
    // }]

    /*收货方获得焦点事件*/
    /*收货方的盒子隐藏*/
    $scope.takeBox = false;
    /*input焦点事件*/
    // $scope.take = function() {
    //     /*全部搜索框弄好之后，这个就没有用了*/
    //     $('#box1').css('display', 'block');
    //     $scope.takeBox = true;
    //     /*选中盒子内容放到input框里面，并隐藏盒子*/
        
    // }
    // $scope.take1=function(){
    //     if($scope.takeBox){
    //        $scope.takeBox = false;  
    //    }else{
    //        $scope.takeBox = true;
    //         $('#box1').css('display', 'block');
          
    //    }
    // }
    $scope.searchfh=function(){
        var sev1=document.getElementById("searval1");
        var seval1=sev1.value;
        var clientCode1=null;
        var clientName1=null;
        if(seval1==""){
            alert("请输入搜索内容");
        }else if(/^\d+$/g.test(seval1)){
            clientCode1=seval1;
            url='http://10.129.83.20:8080/ship/getClientInfo?clientCode='+clientCode1
            
        }else if(/^[\u4E00-\u9FFF]+$/g.test(seval1)){
            clientName1=seval1;
            url='http://10.129.83.20:8080/ship/getClientInfo?clientName='+clientName1
        }else{
            alert("请输入客户编号或者客户名称");
        }
    $http({
      url:url,
      method:"POST",
      headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {

        }
    }).success(function(data){
        console.log(data);
        var data1=data.data;
        $scope.item1=[];
        if(data1.length>10){
            data1=data1.slice(0,10);
        }
       for(var i=0;i<data1.length;i++){
          $scope.item1.push(data1[i]);
        }
        $scope.shipments = true;
        $('#box2').css('display', 'block');
        $scope.takeCon = function(take){
            $scope.takeDetlis1 = take.clientName;
            $scope.shipments= false;
            var onfhId=take.id;
            window.localStorage.setItem("shipperId",take.clientCode);
            $http({
            url:'http://10.129.83.20:8080/ship/getClientInfoById?id='+onfhId,
            method:"POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {

            }
            }).success(function(data1){
                 var data2=data1.data[0];
                    routeId=data2.routeId;
                    $("#consigner").val(data2.contacts);
                    $("#consigner_mobile").val(data2.contactNumber);
                    $("#consigner_address").val(data2.address);
            }) 
        }
    })
    }  
    $scope.show=false;
    window.localStorage.setItem("freightPayer",1);
    $scope.serbtn=function(){
    //$("#reway").css("display","block");
        if(!$scope.show){
            $scope.show=true;
            $("#ways").css("display","block");
        }else{
            $scope.show=false;
        }
         var lis=$("#ways ul li");
        for(var k=0; k<lis.length; k++){
        lis[k].onclick = (function(num){
            return function(){
                $("#valway").val(this.getAttribute("infinityname"))
                console.log(this.getAttribute("infinityid"))
                window.localStorage.setItem("freightPayer",this.getAttribute("infinityid"));
                $scope.show=false;
                console.log( $scope.show);
                $("#ways").css("display","none");
                change();
            };
            
        })(k);
    }
    };
    /*添加行*/
    $scope.lines = [];
    $scope.addLine = function() {
        var addObj = { checkB: null, goodsName: null, idNumber: null };
        $scope.lines.push(addObj);
    }

    /*删除行*/
    $scope.delLine = function() {
       var fg=[];
        var delist= $("input[type='checkbox']");
        for(var i=0;i<delist.length;i++){
            if(delist[i].checked){
                fg.push(i);
                               
            }
        }
           for(var i=0;i<fg.length;i++){
                if(i==0){
                    $scope.lines.splice(fg[i]-1,1);
                }else{
                    $scope.lines.splice(fg[i]-1-i,1);
                }               
            }     
        for(var i=0;i<delist.length;i++){
            delist[i].checked=false;
        }
    }
    /*全选*/
    $scope.selectAll=function(){
        console.log( $scope.lines)
        for(var i=0;i<$scope.lines.length;i++){
            $scope.lines[i].checkB=true;
        }
        $("input[type='checkbox']").attr("checked",true);
    }
    $("#transport_charge").keyup(function(){
          change();
        });
    function change(){
        var sfway=parseFloat(window.localStorage.getItem("receivingWay"));
        var tranway=parseFloat(window.localStorage.getItem("freightPayer"));
        var collection_payment=parseFloat($("#collection_payment").val()); //代收货款
        var transport_charge=parseFloat($("#transport_charge").val());//运费
        var receivables=$("#receivables")[0];//服务站收款
        var payment_by_dispatcher=$("#payment_by_dispatcher")[0];//配收员收款
        console.log(sfway);
       if(sfway==0){
            if(tranway==1){
                console.log(collection_payment);
                receivables.value=parseFloat(0);
                payment_by_dispatcher.value=collection_payment+transport_charge;                
            }else{
                 receivables.value=transport_charge;
                payment_by_dispatcher.value=collection_payment;
            }
       }else{
            if(tranway==1){
                receivables.value=collection_payment+transport_charge;
                payment_by_dispatcher.value=0;                
            }else{
                receivables.value=collection_payment;
                payment_by_dispatcher.value=transport_charge;
            }

       }
    }

            
    /*点击提交按钮*/
    $scope.saveDraft = function() {
        var i = 3;
        var trlist=$("#field_tms_order_goods tbody tr");
        var orOrderItemPo=[];

        var fromPersonName= $("#consigner").val();  //发货人
        var fromContactNumber=$("#consigner_mobile").val();  //发货联系电话
        var fromContactAddress=$("#consigner_address").val();  //发货地址
        var toPersonName= $("#receive_person").val();                                        
        var toContactNumber=$("#receive_telephone").val();
        var toContactAddress=$("#receive_address").val();
        var stationId=null;
        var receiverId=window.localStorage.getItem("receiverId");
        var frequencyId=window.localStorage.getItem("frequencyId");
        var routeId=window.localStorage.getItem("routeId");
        var receivingWay=window.localStorage.getItem("receivingWay");
        var shipperId=window.localStorage.getItem("shipperId");
        var collectionDelivery=$("#collection_payment").val();
        var freightCharge=$("#transport_charge").val();
        var freightPayer= window.localStorage.getItem("freightPayer");
        var serviceReceive=parseFloat($("#receivables").val());
        var diliverymanReceive=parseFloat($("#payment_by_dispatcher").val());
        var paymentMethod="1";
        var remark=$("#remark").val();
        var goodsNumber=$("#fee_goods_count").val();
        for(var i=0;i<trlist.length;i++){
            console.log(trlist[i].children[2].children[0].value);
            orOrderItemPo.push({
                "quantity":parseInt(trlist[i].children[3].children[0].value),
                "goodsName":trlist[i].children[2].children[0].value
            })
        }
        orOrderItemPo=JSON.stringify(orOrderItemPo);
        console.log(orOrderItemPo);
        var parameter={
            "fromPersonName":fromPersonName,
            "fromContactNumber":fromContactNumber,
            "fromContactAddress":fromContactAddress,
            "toPersonName":toPersonName,
            "toContactNumber":toContactNumber,
            "toContactAddress":toContactAddress,
            "receiverId":receiverId,
            "frequencyId":frequencyId,
            "routeId":routeId,
            "receivingWay":receivingWay,
            "shipperId":shipperId,
            "collectionDelivery":collectionDelivery,
            "freightCharge":freightCharge,
            "freightPayer":freightPayer,
            "serviceReceive":serviceReceive,
            "diliverymanReceive":diliverymanReceive,
            "paymentMethod":paymentMethod,
            "remark":remark,
            "goodsNumber":goodsNumber,
            "orOrderItemPo":orOrderItemPo

        }
        $http({
            url:'http://10.129.83.20:8080/ship/insertDispatchBill',
            method:"POST",
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: function(obj) {
                var str = [];
                for (var p in obj) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            },

        data: parameter,
        }).success(function(data){
            console.log(data);

        })
        var timePromise = $interval(function() {
            if (i <= 0) {
                $scope.prompt = false;
                $interval.cancel(timePromise);
                timePromise = undefined;
            } else {
                $scope.prompt = true;
                i--;
            }
        }, 1000, 3000);
    }

}]);

/*发货单查询*/
app.controller('receivecheck', ['$scope', '$state','$http', function($scope, $state,$http) {
    /*平账弹出框*/
    $scope.popUp = false;
    $scope.bisectionBtn = function() {

        $scope.popUp = true;
    }
    $scope.bisectionCancel = function() {
        $scope.popUp = false;
    }

    /*取消弹出框*/
    $scope.cancel = false;
    $scope.cancelBtn = function() {
        $scope.cancel = true;
    }
    $scope.cancelCancel = function() {
        $scope.cancel = false;
    }
    /*收货单查询*/
   /*收货方搜索*/
   $scope.reKeyup=function($event){
        var restr=$("#receiver").val();
        rece(restr,0);
    };
    $scope.seKeyup=function($event){
        var sestr=$("#sender").val();
        rece(sestr,1);
    }
   /*收发货方模糊搜索*/
   function rece(str,fg){
            if(str==""){
                url='http://10.129.83.20:8080/ship/getClientInfo?'
            }else if(/^\d+$/g.test(str)){    
                 url='http://10.129.83.20:8080/ship/getClientInfo?clientCode='+str;
            
            }else if(/^[\u4E00-\u9FFF]+$/g.test(str)){
                url='http://10.129.83.20:8080/ship/getClientInfo?clientName='+str;
            }else{
               url='http://10.129.83.20:8080/ship/getClientInfo?'
            }
        $http({
          url:url,
          method:"POST",
          headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {

            }
        }).success(function(data){
            var data=data.data;
           if(fg==0){
                receList(data);
           }else{
                senList(data);
           }
                
        })
           
           
   }
   /*收货方选中搜索*/
   function receList(data){
        $scope.receiverList=[];
        $("#recebox").css("display","block");
        $scope.receBox=true;
        for(var i=0;i<data.length;i++){
            $scope.receiverList.push(data[i]);
        }
        $scope.recebtn=function(i){
            $("#receiver").val(i.clientName);
            window.localStorage.setItem("recebtnId",i.id);//收货方id
            $scope.receBox=false;
        }
   }
    /*发货方选中搜索*/
   function senList(data){
        $scope.senderList=[];
        $("#senbox").css("display","block");
        $scope.senBox=true;
        for(var i=0;i<data.length;i++){
            $scope.senderList.push(data[i]);
        }
        $scope.senbtn=function(i){
            $("#sender").val(i.clientName);
            window.localStorage.setItem("senbtnId",i.id);//发货方id
            $scope.senBox=false;
        }
   }
   /*路线查询*/
   /*路线列表生成*/
   $scope.lineBox=false;
   $scope.lineser=function(){
        if(!$scope.lineBox){
            $("#linebox").css("display","block");
            $scope.lineBox=true;
        }else{
            $scope.lineBox=false;
        }
        $http({
            url:'http://10.129.83.20:8080/serviceLine/getAllServiceLine',
             method:"POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {

            }
        }).success(function(data){
            var lines=data.data;
            var len=lines.length;
            $scope.lineList=[];
            for(var i=0;i<len;i++){
                $scope.lineList.push(lines[i]);
            }
        });
   }
   /*路线选中*/
   $scope.lineBtn=function(i){
        $("#lineId").val(i.lineName);
        window.localStorage.setItem("routeId",i.id);
        var linesId=i.id;
        $scope.lineBox=false;
         /*班次匹配*/
        $http({
            url:'http://10.129.83.20:8080/serviceLine/getLineRunsByServiceLine?id='+linesId,
            method:"POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {

            }
        }).success(function(data){
            var runtimes=data.data;
            console.log(runtimes);
            var runlen=runtimes.length;
            $scope.runtimeList=[];
            for(var i=0;i<runlen;i++){
                $scope.runtimeList.push(runtimes[i]);
            } 

        })
   }
    $scope.runtimebox=false;
    /*班次搜索*/
   $scope.runtimeBtn=function(){
        if(!$scope.runtimebox){
            $scope.runtimebox=true;
            $("#runtimeBox").css("display","block");
        }else{
            $scope.runtimebox=false;
        }
   }
   $scope.runsBtn=function(i){
    $("#linetime").val(i.runTime);
    $scope.runtimebox=false;
    window.localStorage.setItem("frequencyId",i.id);
   }
   $scope.stateBox=false;
   $scope.stateBtn=function(){
        if(!$scope.stateBox){
            $scope.stateBox=true;
            $("#statebox").css("display","block");
        }else{
             $scope.stateBox=false;
        }
   }
   var statelis=$("#statebox ul li");
   for(var k=0; k<statelis.length; k++){
        statelis[k].onclick = (function(num){
            return function(){
                $("#stateVal").val(this.getAttribute("infinityname"))
                console.log(this.getAttribute("infinityid"))
                window.localStorage.setItem("receivingStatus",this.getAttribute("infinityid"));
                $scope.stateBox=false;
                $("#statebox").css("display","none");
            };
            
        })(k);
    }
    $scope.dat = new Date();
    $scope.format = "yyyy-MM-dd";
    $scope.altInputFormats = ['yyyy-M!-d!'];
    $scope.popup1 = {
        opened: false
    };
    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };
    $scope.demand=function(){
        var numbers=$("#searcode").val();
        var createTime=$("#createTime").val();
        var recebtnId=window.localStorage.getItem("recebtnId");
        var senbtnId=window.localStorage.getItem("senbtnId");
        var routeId=window.localStorage.getItem("routeId");
        var frequencyId=window.localStorage.getItem("frequencyId");
        var receivingStatus=window.localStorage.getItem("receivingStatus");
        var list={
           " currentPage":1,
            "itemsPerPage":2,
            "stationId":1,
            "numbers":numbers,
            "receiverId":recebtnId,
            "shipperId":senbtnId, //发货方编号
            "frequencyId":frequencyId,  //班次编号
            "routeId":routeId,  //否   Long    线路编号
            "receivingStatus":receivingStatus
        }
        $http({
            url:'http://10.129.83.20:8080/ship/getDispatchBillInfoList',
            method:"POST",
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: function(obj) {
                var str = [];
                for (var p in obj) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            },

        data:{
            " currentPage":1,
            "itemsPerPage":2
        }
        }).success(function(data){
            console.log(data);

        })
    }


}])

/*查看发货单*/
app.controller('seeWaybill', ['$scope', '$state', function($scope, $state) {
    /*取消发货单弹出框*/
    $scope.invoice = false;
    $scope.invoiceBtn = function() {
        $scope.invoice = true;
    }
    $scope.invoiceCancel = function() {
        $scope.invoice = false;
    }
}])
