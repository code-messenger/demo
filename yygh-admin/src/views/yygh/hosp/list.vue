<template>
	<div class="app-container">
		<el-form :inline="true" class="demo-form-inline">
			<el-form-item>
				<el-select v-model="searchObj.provinceCode" placeholder="请选择省" @change="provinceChanged">
					<el-option v-for="item in provinceList" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>

			<el-form-item>
				<el-select v-model="searchObj.cityCode" placeholder="请选择市">
					<el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>

			<el-form-item>
				<el-input v-model="searchObj.hosname" placeholder="医院名称" />
			</el-form-item>

			<el-button type="primary" icon="el-icon-search" style="margin-left: 15px" @click="fetchData()">查询</el-button>
			<el-button
				type="default"
				plane="true"
				icon="el-icon-delete"
				style="margin-left: 20px"
				@click="resetData()"
			>清空</el-button>
		</el-form>

		<!-- banner列表 -->
		<el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
			<el-table-column label="序号" width="60" align="center">
				<template slot-scope="scope">
					{{
					(page - 1) * limit + scope.$index + 1
					}}
				</template>
			</el-table-column>

			<el-table-column label="医院logo" align="center">
				<template slot-scope="scope">
					<img :src="'data:image/jpeg;base64,' + scope.row.logoData" width="80" />
				</template>
			</el-table-column>

			<el-table-column prop="hosname" label="医院名称" align="center" />
			<el-table-column prop="param.hostypeString" label="等级" width="90" align="center" />
			<el-table-column prop="param.fullAddress" label="详情地址" align="center" />
			<el-table-column label="状态" width="80" align="center">
				<template slot-scope="scope">
					<el-tag v-if="scope.row.status === 1">上线</el-tag>
					<el-tag type="danger" v-if="scope.row.status === 0">下线</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" align="center" />

			<el-table-column label="操作" width="300" align="center">
				<template slot-scope="scope">
					<el-button
						v-if="scope.row.status == 0"
						type="success"
						plain="true"
						size="mini"
						icon="el-icon-success"
						@click="updateStatus(scope.row.id, 1)"
						style="margin-left: 10px"
					>上线</el-button>
					<el-button
						v-if="scope.row.status == 1"
						type="info"
						plain="true"
						size="mini"
						icon="el-icon-error"
						@click="updateStatus(scope.row.id, 0)"
						style="margin-left: 15px"
					>下线</el-button>
					<router-link :to="'/yygh/hospset/hospital/show/' + scope.row.id">
						<el-button type="success" size="mini" icon="el-icon-view" style="margin-left: 15px">查看</el-button>
					</router-link>
					<router-link :to="'/yygh/hospSet/hospital/schedule/' + scope.row.hoscode">
						<el-button type="primary" size="mini" icon="el-icon-date" style="margin-left: 15px">排班</el-button>
					</router-link>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页组件 -->
		<el-pagination
			:current-page="page"
			:total="total"
			:page-size="limit"
			:page-sizes="[5, 10, 20, 30, 40, 50, 100]"
			style="padding: 20px 0; text-align: center"
			layout="total, sizes, prev, pager, next, jumper"
			background
			@current-change="fetchData"
			@size-change="changeSize"
		/>
	</div>
</template>

<script>
	import dictApi from '@/api/yygh/dict'
	import hospApi from '@/api/yygh/hosp'

	export default {
	  data() {
	    return {
	      listLoading: true, // 数据是否正在加载
	      list: null, // 医院列表数据集合
	      total: 0, // 数据库中的总记录数
	      page: 1, // 默认页码
	      limit: 10, // 每页记录数
	      searchObj: {
	        provinceCode: '',
	        cityCode: ''
	      }, // 查询表单对象
	      provinceList: [], // 所有省集合
	      cityList: [] // 所有市集合
	    }
	  },
	  created() {
	    // 加载省数据
	    this.getProvinceList()
	    // 加载医院列表数据
	    this.fetchData()
	  },
	  methods: {
	    // 查询省数据
	    getProvinceList() {
	      dictApi.findChildDateByDictCode('Province').then((res) => {
	        this.provinceList = res.data.list
	      })
	    },
	    // 查询医院列表数据
	    fetchData(page = 1) {
	      this.page = page
	      hospApi
	        .hospPageInfo(this.page, this.limit, this.searchObj)
	        .then((res) => {
	          this.list = res.data.pageModel.content
	          this.total = res.data.pageModel.totalElements
	          this.listLoading = false
	        })
	    },
	    // 省变化时，加载对应的市数据 二级联动
	    provinceChanged() {
	      // 先清空市数据
	      this.cityList = []
	      this.searchObj.cityCode = ''

	      // 根据省级id加载市数据
	      dictApi
	        .findChildDateByParentId(this.searchObj.provinceCode)
	        .then((res) => {
	          this.cityList = res.data.list
	        })
	    },
	    // 清空查询条件
	    resetData() {
	      this.searchObj = {
	        provinceCode: '',
	        cityCode: ''
	      }
	      this.fetchData()
	    },
	    // 分页改变
	    changeSize(limit) {
	      this.limit = limit
	      this.fetchData()
	    },
	    // 更新医院状态
	    updateStatus(id, status) {
	      hospApi
	        .updateStatus(id, status)
	        .then((response) => {
	          this.$message({
	            type: 'success',
	            message: '操作成功!'
	          })
	          this.fetchData(this.page)
	        })
	        .catch(() => {
	          this.$message({
	            type: 'info',
	            message: '操作失败'
	          })
	        })
	    }
	  }
	}
</script>
