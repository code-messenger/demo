<template>
  <div class="app-container">
    <!-- 查询表单 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="searchObj.hosname" placeholder="医院名称" />
      </el-form-item>

      <el-form-item>
        <el-input v-model="searchObj.hoscode" placeholder="医院编号" />
      </el-form-item>

      <el-button
        type="primary"
        style="margin-left: 20px"
        icon="el-icon-search"
        @click="getList()"
        > 查询</el-button
      >
      <el-button
        type="success"
        icon="el-icon-delete"
        style="margin-left: 20px"
        @click="resetData()"
        > 清空</el-button
      >
    </el-form>
    <!-- 工具条 -->
    <div style="margin-bottom: 15px">
      <el-button type="danger" size="mini" @click="removeRows()"
        > 批量删除</el-button
      >
    </div>

    <!-- 表格数据 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column
        prop="hosname"
        label="医院名称"
        width="180"
        align="center"
      />

      <el-table-column
        prop="hoscode"
        label="医院编号"
        width="160"
        align="center"
      />

      <el-table-column prop="apiUrl" label="地址" width="200" align="center" />

      <el-table-column prop="contactsName" label="联系人" align="center" />

      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <!-- {{ scope.row.status === 1 ? "启用":"禁用" }} -->
          <el-tag v-if="scope.row.status === 1">启用</el-tag>
          <el-tag type="danger" v-if="scope.row.status === 0">禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status == 0"
            type="success"
            plain="true"
            size="mini"
            icon="el-icon-success"
            @click="lockHospSet(scope.row.id, 1)"
            style="margin-left: 10px"
            >启用</el-button
          >
          <el-button
            v-if="scope.row.status == 1"
            type="info"
            plain="true"
            size="mini"
            icon="el-icon-error"
            @click="lockHospSet(scope.row.id, 0)"
            style="margin-left: 15px"
            >禁用</el-button
          >
          <router-link :to="'/yygh/hospset/edit/' + scope.row.id">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              style="margin-left: 15px"
              >修改</el-button
            >
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
            style="margin-left: 15px"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />
  </div>
</template>

<script>
import hospsetApi from "@/api/yygh/hospset";

export default {
  data() {
    return {
      listLoading: true, // 页面加载标识
      list: [], // 表格数据
      page: 1, // 当前页面
      limit: 10, // 每页显示条数
      total: 0, // 总记录数
      searchObj: {}, // 查询条件
      multipleSelection: [], // 批量选择中选择的记录列表
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 分页带条件查询
    getList(page = 1) {
      this.page = page;
      hospsetApi
        .pageInfo(this.page, this.limit, this.searchObj)
        .then((response) => {
          console.log(response);
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        });
    },
    // 清空
    resetData() {
      this.searchObj = {};
      this.getList();
    },
    // 根据id删除
    removeDataById(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          hospsetApi.delHospSet(id).then((response) => {
            this.getList();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //多选框选择方法
    handleSelectionChange(selection) {
      console.log(selection);
      this.multipleSelection = selection;
    },
    // 批量删除
    removeRows() {
      this.$confirm("此操作将永久删除多条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 创建集合对象
          let idList = [];

          // for (let i = 0; i < this.multipleSelection.length; i++) {
          //   let hospsetid = this.multipleSelection[i].id;
          //   idList.push(hospsetid);
          // }

          // 遍历集合;
          this.multipleSelection.forEach((item) => {
            // console.log(item.id);
            idList.push(item.id);
          });

          // 调用接口批量删除
          hospsetApi.batchRemove(idList).then((response) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 设置医院状态
    lockHospSet(id, status) {
      hospsetApi
        .lockHospitalSet(id, status)
        .then((response) => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.getList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "操作失败",
          });
        });
    },
  },
};
</script>

