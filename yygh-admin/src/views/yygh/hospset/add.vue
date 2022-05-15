<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="医院名称">
        <el-input v-model="hospset.hosname" />
      </el-form-item>
      <el-form-item label="医院编号">
        <el-input v-model="hospset.hoscode" />
      </el-form-item>
      <el-form-item label="api地址">
        <el-input v-model="hospset.apiUrl" />
      </el-form-item>
      <el-form-item label="联系人">
        <el-input v-model="hospset.contactsName" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="hospset.contactsPhone" />
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import hospsetApi from "@/api/yygh/hospset";

export default {
  data() {
    return {
      id: "",
      hospset: {}, // 表单对象
      saveBtnDisabled: false, // 按钮是否不可操作
    };
  },

  created() {
    if (this.$route.params && this.$route.params.id) {
      console.log(this.$route.params.id);
      this.id = this.$route.params.id;
      hospsetApi.getHospSetById(this.id).then((response) => {
        this.hospset = response.data.hospitalSet;
      });
    }
  },

  methods: {
    // 新增或修改的保存方法
    saveOrUpdate() {
      if (this.hospset.id) {
        // 修改
        this.updateHospset();
      } else {
        // 新增
        this.savaHospset();
      }
    },
    savaHospset() {
      hospsetApi.addHospSet(this.hospset).then((response) => {
        this.$message({
          showClose: true,
          type: "success",
          message: "添加成功!",
          center: true,
        });
        this.$router.push({ path: "/yygh/hospset/list" }); // 路由到医院设置列表
      });
    },
    updateHospset() {
      hospsetApi.updateHospSet(this.hospset).then((response) => {
        this.$message({
          showClose: true,
          type: "success",
          message: "修改成功!",
          center: true,
        });
        this.$router.push({ path: "/yygh/hospset/list" }); // 路由到医院设置列表
      });
    },
  },
};
</script>