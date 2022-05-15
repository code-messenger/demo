<template>
  <div class="app-container">
    <div style="margin-bottom: 10px; font-size: 10px">选择：</div>
    <el-container style="height: 100%">
      <el-aside width="200px" style="border: 1px silver solid">
        <!-- 部门 -->
        <el-tree :data="data" :props="defaultProps" :default-expand-all="true" @node-click="handleNodeClick"></el-tree>
      </el-aside>
      <el-main style="padding: 0 0 0 20px">
        <el-row style="width: 100%">
          <!-- 排班日期 分页 -->
          <el-tag v-for="(item, index) in bookingScheduleList" :key="item.id" @click="selectDate(item.workDate, index)"
            :type="index == activeIndex ? '' : 'info'" style="
              height: 60px;
              margin-right: 5px;
              margin-right: 15px;
              cursor: pointer;">
            {{ item.workDate }} {{ item.dayOfWeek }}
            <br />
            {{ item.availableNumber }} / {{ item.reservedNumber }}
          </el-tag>
          <!-- 分页 -->
          <el-pagination :current-page="page" :total="total" :page-size="limit" class="pagination"
            layout="prev, pager, next" @current-change="getPage"></el-pagination>
        </el-row>
        <el-row style="margin-top: 20px">
          <!-- 排班日期对应的排班医生 -->
          <el-table v-loading="listLoading" :data="scheduleList" border fit highlight-current-row>
            <el-table-column label="序号" width="60" align="center">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column label="职称" width="150">
              <template slot-scope="scope">{{ scope.row.title }} | {{ scope.row.docname }}</template>
            </el-table-column>
            <el-table-column label="号源时间" width="80">
              <template slot-scope="scope">{{ scope.row.workTime == 0 ? "上午" : "下午" }}</template>
            </el-table-column>
            <el-table-column prop="reservedNumber" label="可预约数" width="80" />
            <el-table-column prop="availableNumber" label="剩余预约数" width="100" />
            <el-table-column prop="amount" label="挂号费(元)" width="90" />
            <el-table-column prop="skill" label="擅长技能" />
          </el-table>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import deptApi from "@/api/yygh/dept";
import scheduleApi from "@/api/yygh/schedule";
export default {
  data() {
    return {
      data: [], // 科室集合数据
      defaultProps: {
        children: "children",
        label: "depname",
      },
      hoscode: "", // 医院编码
      activeIndex: 0, // 选中日期的标签索引
      depcode: null, // 科室编码
      depname: null, // 科室名称
      workDate: null, // 统计日期

      bookingScheduleList: [], // 按照日期统计的排班集合
      baseMap: {}, // 页面显示基础信息

      page: 1, // 当前页
      limit: 7, // 每页个数
      total: 0, // 总页码
      listLoading: true, // 表格加载状态
      scheduleList: [], // 表格数据
    };
  },

  created() {
    this.hoscode = this.$route.params.hoscode;
    this.workDate = this.getCurDate();
    this.getDeptVoList();
  },

  methods: {
    getDeptVoList() {
      // 科室列表初始化
      deptApi.getDeptByHospcode(this.hoscode).then((res) => {
        this.data = res.data.departmentList;
        // 默认选中第一个小科室
        if (this.data.length > 0) {
          this.depcode = this.data[0].children[0].depcode;
          this.depname = this.data[0].children[0].depname;
          this.getPage();
        }
      });
    },
    // 分页查询
    getPage(page = 1) {
      this.page = page;
      this.workDate = null;
      this.activeIndex = 0;
      this.pageShow();
    },
    // 获取排班信息
    pageShow() {
      scheduleApi
        .getScheduleRule(this.page, this.limit, this.hoscode, this.depcode)
        .then((res) => {
          this.bookingScheduleList = res.data.bookingScheduleRuleVoList;
          this.total = res.data.total;
          this.baseMap = res.data.baseMap;
          this.workDate == null
            ? (this.workDate = this.bookingScheduleList[0].workDate)
            : this.workDate;
          this.getScheduleList();
        });
    },
    // 选中科室触发事件
    handleNodeClick(data) {
      // 如果是大科室直接返回
      if (data.children != null) return;
      this.depcode = data.depcode;
      this.depname = data.depname;
      this.getPage();
    },
    // 选中日期触发事件
    selectDate(workDate, index) {
      this.workDate = workDate;
      this.activeIndex = index;
      // 查询排班详细集合数据
      this.getScheduleList();
    },
    // 获取当前日期
    getCurDate() {
      var datetime = new Date();
      var year = datetime.getFullYear();
      var month =
        datetime.getMonth() + 1 < 10
          ? "0" + (datetime.getMonth() + 1)
          : datetime.getMonth() + 1;
      var date =
        datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
      return year + "-" + month + "-" + date;
    },
    // 查询排班信息
    getScheduleList() {
      scheduleApi
        .getScheduleDetail(this.hoscode, this.depcode, this.workDate)
        .then((res) => {
          this.scheduleList = res.data.list;
          this.listLoading = false;
        });
    },
  },
};
</script>

<style>
.el-tree-node.is-current>.el-tree-node__content {
  background-color: #409eff !important;
  color: white;
}

.el-checkbox__input.is-checked+.el-checkbox__label {
  color: black;
}
</style>
