<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2018/2/28
  Time: 16:04
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0">

  <title>${name}</title>
  <style>
    body {
      margin: 0;
      font-size: 16px;
    }

    .receiveCoupons {
      overflow: auto;
      color: #333;
      background-color: #eee;
      height: 100%;
    }

    .forceBanner {
      height: 100%;
      position: relative;
      background-image: url("http://qnzg.image.alimmdn.com/wxhd/forceFollow-bg1.png?t=1519898661005");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }

    .coupon {
      width: 4.0rem;
      height: 2.186667rem;
      position: absolute;
      top: 6.3rem;
      left: 3.053333rem;
      background-size: 100% 100%;
    }

    .coupon1 {
      background-image: url("http://qnzg.image.alimmdn.com/wxhd/dpyhq.png?t=1519898812012");
    }

    .coupon2 {
      background-image: url("http://qnzg.image.alimmdn.com/wxhd/spyhq.png?t=1519898927736");
    }

    .couponBtn {
      width: 6.426667rem;
      height: 1.213333rem;
      position: absolute;
      /*top: 14.226667rem;*/
      bottom:1.5rem;
      left: 1.866667rem;
      text-align: center;
      line-height: 1.213333rem;
      color: #fff;
      font-size: 0.453333rem;
      text-decoration: none !important;
      background-image: url("http://qnzg.image.alimmdn.com/wxhd/forceFollow-btn.png?t=1519898852618");
      background-size: 100% 100%;
    }

    .couponPrice {
      width: 3.0rem;
      height: 1.066667rem;
      position: absolute;
      top: 6.573333rem;
      left: 3.173333rem;
      text-align: center;
      line-height: 1.066667rem;
      color: #fff;
    }

    .couponPrice span {
      font-size: 0.533333rem;
    }

    .couponLimit {
      width: 3.0rem;
      height: 0.533333rem;
      position: absolute;
      top: 7.893333rem;
      left: 3.173333rem;
      text-align: center;
      line-height: 0.533333rem;
      color: #fff;
    }

    .couponType {
      width: 0.533333rem;
      position: absolute;
      top: 6.453333rem;
      left: 6.493333rem;
      text-align: center;
      line-height: 0.386667rem;
      color: #fff;
    }

    .listBanner {
      height: 3.466667rem;
      background-image: url("http://qnzg.image.alimmdn.com/wxhd/forceFollow-bg2.png?t=1519898711925");
      background-size: 100% 100%;
    }

    .receiveCoupons ul {
      padding: 0 0.4rem;
    }

    ul li {
      margin-top: 0.266666rem;
      height: 2.506666rem;
      background-repeat: no-repeat;
      background-origin: content-box;
      background-size: 100% 100%;
      font-size: 0.373333rem;
      position: relative;
    }

    ul .coupon-shop {
      background-image: url("http://qnzg.image.alimmdn.com/wxhd/yhq-bg.png?t=1519898778190");
    }

    ul .coupon-item {
      background-image: url("http://qnzg.image.alimmdn.com/wxhd/yhq-bg2.png?t=1519898747548");
    }

    ul li span {
      position: absolute;
    }

    ul li span i {
      font-style: normal;
      font-size: 0.4rem;
    }

    ul li span em {
      font-style: normal;
      font-size: 0.4rem;
    }

    ul li .prize-detail-top {
      left: 1.666666rem;
      top: 0;
      font-size: 0.853333rem;
    }

    ul li .prize-detail-bottom {
      bottom: 0.066666rem;
      left: 1.666666rem;
      font-size: 0.32rem;
      color: #999;
    }

    ul li .prize-detail-middle {
      left: 1.666666rem;
      top: 1.16rem;
    }

    ul li .prize-detail-left {
      width: 0.466666rem;
      line-height: 1.1;
      top: 0.24rem;
      left: 0.48rem;
      color: #ff5a5b;
    }

    ul li .prize-detail-right {
      right: 0.32rem;
      width: 1.166666rem;
      top: 0.4rem;
      font-size: 0.533333rem;
      color: #fff;
      display: block;
      height: 1.066667rem
    }

    ul li .prize-detail-right .link-a {
      color: #fff;
      text-decoration: none;
    }

    .cover {
      position: fixed;
      width: 100vw;
      height: 100vh;
      top: 0;
      left: 0;
      background: rgba(50, 50, 50, 0.95);
      z-index: 1;
    }

    .closemodel {
      display: none;
    }

    .weui-dialog {
      max-width: 6.8rem;
      width: 6.8rem;
      padding: 1.066667rem 0.6rem 0.4rem 0.6rem;
      border-radius: 0.2rem;
      box-sizing: border-box;
      overflow: visible;
      position: fixed;
      z-index: 5000;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #FFFFFF;
      text-align: center;
    }

    .weui-dialog .dialog-content {
      color: #333;
      font-size: 0.373333rem;
      margin-bottom: 0.8rem;
    }
  </style>
  <script src="/force/flexible.js"></script>
  <script src="/force/flexible_css.debug.js"></script>
  <script src="/force/jquery.min.js"></script>
  <script src="//g.alicdn.com/tmapp/tida/3.2.114/tida.js?appkey=23090346"></script>
</head>
<body>

<div class="receiveCoupons">
  <c:if test="${errorCode == '30001'}">
  <div class="forceBanner">
    <div class="coupon coupon1"></div>
      <%--<div class="coupon coupon2"></div>--%>
    <a class="couponBtn">立即领取</a>

    <div class="couponPrice">
      ￥
      <span>10</span>
    </div>
    <div class="couponLimit">
      满100元使用
    </div>
    <div class="couponType">
      商品优惠券
    </div>
  </div>

  <!-- 多个的-->
  <div class="listBanner "></div>
  <ul class="closemodel">
    <li class="coupon-item">
        <span class="prize-detail-top">
          <i>
            ￥
          </i>
          10
        </span>
        <span class="prize-detail-bottom">
          有效期：2018/02/27-2018/04/24
        </span>
        <span class="prize-detail-middle">
          <em>满100元使用</em>
          <%--<em>无门槛使用</em>--%>
        </span>
        <span class="prize-detail-left">
          <span>
            商品优惠券
          </span>
          <%--<span>
            店铺优惠券
          </span>--%>
        </span>
        <span class="prize-detail-right">
          <a class="link-a">
            立即领取
          </a>
        </span>
    </li>
  </ul>
  </c:if>
  <c:if test="${errorCode != '30001'}">
  <!-- 一个的 -->
  <c:if test="${moreOne == '0'}">
  <div class="forceBanner">
    </c:if>
    <c:if test="${moreOne == '1'}">
    <div class="forceBanner closemodel">
    </c:if>
      <c:if test="${activity.prizes[0].subType == 'coupon_goods'}">
        <div class="coupon coupon1"></div>
      </c:if>
      <c:if test="${activity.prizes[0].subType == 'coupon_shop'}">
        <div class="coupon coupon2"></div>
      </c:if>
      <a class="couponBtn receiveBtn" href="${activity.prizes[0].url}">立即领取</a>

      <div class="couponPrice">
        ￥
        <span>${activity.prizes[0].denomination/100}</span>
      </div>
      <div class="couponLimit">
        <c:if test="${activity.prizes[0].useCondition != null}">
          满${activity.prizes[0].useCondition/100}元使用
        </c:if>
        <c:if test="${activity.prizes[0].useCondition == null}">
          无门槛优惠券
        </c:if>
      </div>
      <div class="couponType">
        <c:if test="${activity.prizes[0].subType == 'coupon_goods'}">
          商品优惠券
        </c:if>
        <c:if test="${activity.prizes[0].subType == 'coupon_shop'}">
          店铺优惠券
        </c:if>
      </div>
    </div>
    <!-- 多个的-->
    <c:if test="${moreOne == '0'}">
      <div class="listBanner closemodel"></div>
    </c:if>
    <c:if test="${moreOne == '1'}">
      <div class="listBanner"></div>
    </c:if>
    <c:forEach items="${activity.prizes}" var="prize">
    <c:if test="${moreOne == '0'}">
    <ul class="closemodel">
      </c:if>
      <c:if test="${moreOne == '1'}">
      <ul>
        </c:if>
        <c:if test="${prize.subType == 'coupon_goods'}">
        <li class="coupon-item">
          </c:if>
          <c:if test="${prize.subType == 'coupon_shop'}">
        <li class="coupon-shop">
          </c:if>
          <span class="prize-detail-top">
            <i>
              ￥
            </i>
            ${prize.denomination/100}
          </span>
          <span class="prize-detail-bottom">
            有效期：${prize.startTimeStr}至${prize.endTimeStr}
          </span>
          <span class="prize-detail-middle">
            <c:if test="${prize.useCondition != null}">
              <em>满${prize.useCondition/100}元使用</em>
            </c:if>
            <c:if test="${prize.useCondition == null}">
              <em>无门槛优惠券</em>
            </c:if>
          </span>
          <span class="prize-detail-left">
            <c:if test="${prize.subType == 'coupon_goods'}">
              <span>商品优惠券</span>
            </c:if>
            <c:if test="${prize.subType == 'coupon_shop'}">
              <span>店铺优惠券</span>
            </c:if>
          </span>
          <span class="prize-detail-right">
            <a class="link-a receiveBtn" href="${prize.url}">
              立即领取
            </a>
          </span>
        </li>
      </ul>
      </c:forEach>
      </c:if>
      <c:if test="${errorCode != '1'}">
      <div class="cover"></div>
      <div class="weui-dialog">
        </c:if>
        <c:if test="${errorCode == '1'}">
        <div class="cover closemodel"></div>
        <div class="weui-dialog closemodel">
          </c:if>
          <div class="dialog-content">
            <p class="error-message">${errorMessage}</p>
          </div>
        </div>
      </div>
      <script>
        $(document).ready(function () {
          follow();
          $(".receiveBtn").click(function () {
            follow();
          });
          function follow() {
            for (var i = 0; i < 2; i++) {
              Tida && Tida.ready({}, function () {
                Tida.follow2({
                  sellerId: parseInt('${sellerId}')
                }, function (data) {
                  //alert(JSON.stringify(data));
                });
              });
            }
          }
        });
      </script>
</body>
</html>
