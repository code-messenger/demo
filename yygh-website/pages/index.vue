<template>
  <div class="home page-component">
    <el-carousel indicator-position="outside">
      <el-carousel-item v-for="item in 2" :key="item">
        <img src="~assets/images/web-banner1.png" alt />
      </el-carousel-item>
    </el-carousel>
    <!-- 搜索 -->
    <div class="search-container">
      <div class="search-wrapper">
        <div class="hospital-search">
          <el-autocomplete class="search-input" prefix-icon="el-icon-search" v-model="hosname"
            :fetch-suggestions="querySearchAsync" placeholder="点击输入医院名称" @select="handleSelect">
            <span slot="suffix" class="search-btn v-link highlight clickable selected">搜索</span>
          </el-autocomplete>
        </div>
      </div>
    </div>
    <!-- bottom -->
    <div class="bottom">
      <div class="left">
        <div class="home-filter-wrapper">
          <div class="title">医院</div>
          <div>
            <div class="filter-wrapper">
              <span class="label">等级：</span>
              <div class="condition-wrapper">
                <span class="item v-link clickable" :class="hostypeActiveIndex == index ? 'selected' : ''"
                  v-for="(item, index) in hostypeList" :key="item.id" @click="hostypeSelect(item.value, index)">{{
                      item.name
                  }}</span>
              </div>
            </div>
            <div class="filter-wrapper">
              <span class="label">地区：</span>
              <div class="condition-wrapper">
                <span class="item v-link clickable" :class="provinceActiveIndex == index ? 'selected' : ''"
                  v-for="(item, index) in districtList" :key="item.id" @click="districtSelect(item.value, index)">{{
                      item.name
                  }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="v-scroll-list hospital-list">
          <div class="v-card clickable list-item" v-for="item in list" :key="item.id">
            <div class>
              <div class="hospital-list-item hos-item" index="0" @click="show(item.hoscode)">
                <div class="wrapper">
                  <div class="hospital-title">{{ item.hosname }}</div>
                  <div class="bottom-container">
                    <div class="icon-wrapper">
                      <span class="iconfont"></span>
                      {{ item.param.hostypeString }}
                    </div>
                    <div class="icon-wrapper">
                      <span class="iconfont"></span>
                      每天{{ item.bookingRule.releaseTime }}放号
                    </div>
                  </div>
                </div>
                <img :src="'data:image/jpeg;base64,' + item.logoData" :alt="item.hosname" class="hospital-img" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="common-dept">
          <div class="header-wrapper">
            <div class="title">常见科室</div>
            <div class="all-wrapper">
              <span>全部</span>
              <span class="iconfont icon"></span>
            </div>
          </div>
          <div class="content-wrapper">
            <span class="item v-link clickable dark">神经内科</span>
            <span class="item v-link clickable dark">消化内科</span>
            <span class="item v-link clickable dark">呼吸内科</span>
            <span class="item v-link clickable dark">内科</span>
            <span class="item v-link clickable dark">神经外科</span>
            <span class="item v-link clickable dark">妇科</span>
            <span class="item v-link clickable dark">产科</span>
            <span class="item v-link clickable dark">儿科</span>
          </div>
        </div>
        <div class="space">
          <div class="header-wrapper">
            <div class="title-wrapper">
              <div class="icon-wrapper">
                <span class="iconfont title-icon"></span>
              </div>
              <span class="title">平台公告</span>
            </div>
            <div class="all-wrapper">
              <span>全部</span>
              <span class="iconfont icon"></span>
            </div>
          </div>
          <div class="content-wrapper">
            <div class="notice-wrapper">
              <div class="point"></div>
              <span class="notice v-link clickable dark">关于延长北京大学国际医院放假的通知</span>
            </div>
            <div class="notice-wrapper">
              <div class="point"></div>
              <span class="notice v-link clickable dark">北京中医药大学东方医院部分科室医生门诊医</span>
            </div>
            <div class="notice-wrapper">
              <div class="point"></div>
              <span class="notice v-link clickable dark">武警总医院号源暂停更新通知</span>
            </div>
          </div>
        </div>
        <div class="suspend-notice-list space">
          <div class="header-wrapper">
            <div class="title-wrapper">
              <div class="icon-wrapper">
                <span class="iconfont title-icon"></span>
              </div>
              <span class="title">停诊公告</span>
            </div>
            <div class="all-wrapper">
              <span>全部</span>
              <span class="iconfont icon"></span>
            </div>
          </div>
          <div class="content-wrapper">
            <div class="notice-wrapper">
              <div class="point"></div>
              <span class="notice v-link clickable dark">中国人民解放军总医院第六医学中心(原海军总医院)呼吸内科门诊停诊公告</span>
            </div>
            <div class="notice-wrapper">
              <div class="point"></div>
              <span class="notice v-link clickable dark">首都医科大学附属北京潞河医院老年医学科门诊停诊公告</span>
            </div>
            <div class="notice-wrapper">
              <div class="point"></div>
              <span class="notice v-link clickable dark">中日友好医院中西医结合心内科门诊停诊公告</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import hospApi from "../api/hospital";
import dictApi from "../api/dict";

export default {
  // 服务端异步渲染
  asyncData({ params, error }) {
    return hospApi.pageShow(1, 10, null).then(res => {
      return {
        list: res.data.pageModel.content,
        pages: res.data.pageModel.totalPages,
      };
    });
  },
  data() {
    return {
      page: 1,
      limit: 10,
      searchObj: {},
      hosname: "", // 医院名称
      hostypeList: [], // 医院等级集合
      districtList: [], // 地区集合
      hostypeActiveIndex: 0, // 选中医院等级索引
      provinceActiveIndex: 0, // 选中地区等级索引
    
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      // 查询医院等级集合
      dictApi.findChildDateByDictCode("Hostype").then(res => {
        // 清空集合数据
        this.hostypeList = [];
        // 存入"全部"选项
        this.hostypeList.push({ name: "全部", value: "" });
        // 遍历数据存入集合
        // for (let i = 0; i < res.data.list.length; i++) {
        //   this.hostypeList.push(res.data.list[i]);
        // }

        res.data.list.forEach(element => {
          this.hostypeList.push(element);
        });
      });
      // 查询北京地区集合
      dictApi.findChildDateByDictCode("Beijin").then(res => {
        // 清空集合数据
        this.districtList = [];
        // 存入"全部"选项
        this.districtList.push({ name: "全部", value: "" });
        // 遍历数据存入集合
        for (let i in res.data.list) {
          this.districtList.push(res.data.list[i]);
        }
      });
    },
    // 查询医院信息
    getHospitalList() {
      hospApi.pageShow(this.page, this.limit, this.searchObj).then(res => {
        res.data.pageModel.content.forEach(element => {
          this.list.push(element);
        });
        this.pages = res.data.pageModel.totalPages;
      });
    },

    // 根据医院等级查询医院信息
    hostypeSelect(value, index) {
      this.list = [];
      this.page = 1;

      // 设置筛选条件
      this.searchObj.hostype = value;
      this.hostypeActiveIndex = index;

      // 查询
      this.getHospitalList();
    },
    // 根据医院地区查询医院信息
    districtSelect(value, index) {
      // 清空数据
      this.list = [];
      this.page = 1;

      // 设置筛选条件
      this.searchObj.districtCode = value;
      this.provinceActiveIndex = index;

      // 查询
      this.getHospitalList();
    },
    // 搜索查询
    querySearchAsync(queryString, cb) {
      // 初始化
      this.searchObj = [];
      if (queryString == "") return;
      // 查询数据
      hospApi.findByHosname(queryString).then(res => {
        // 遍历集合封装数据
        res.data.hospitalList.forEach(element => {
          element.value = element.hosname;
        });
        // 存入数据
        cb(res.data.hospitalList);
      });
    },
    // 搜索选中数据时 跳转到详情页
    handleSelect(item) {
      window.location.href = '/hospital/' + item.hoscode;
    },

    // 点击医院时 跳转到医院详情页面
    show(hoscode) {
      window.location.href = '/hospital/' + hoscode;
    }
  }
};
</script>
