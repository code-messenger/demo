<template>
	<div class="app-container">
		<div class="el-toolbar">
			<div
				class="el-toolbar-body"
				style="justify-content: flex-start; margin-bottom: 20px"
			>
				<el-button
					type="primary"
					@click="exportData"
					icon="el-icon-download"
					plain
				>下载</el-button>
				<el-button
					type="success"
					@click="importData"
					icon="el-icon-upload"
					plain
				>上传</el-button>
			</div>
		</div>

		<el-table
			:data="list"
			style="width: 100%"
			row-key="id"
			border
			lazy
			:load="load"
			:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
		>
			<el-table-column
				prop="name"
				label="名称"
				width="150"
			></el-table-column>

			<el-table-column
				prop="dictCode"
				label="编码"
				width="150"
			></el-table-column>

			<el-table-column
				prop="value"
				label="值"
				width="150"
			></el-table-column>

			<el-table-column
				prop="createTime"
				label="创建时间"
			></el-table-column>
		</el-table>

		<el-dialog
			title="导入"
			:visible.sync="dialogImportVisible"
			width="480px"
		>
			<el-form
				label-position="right"
				label-width="170px"
			>
				<el-form-item label="文件">
					<el-upload
						:multiple="false"
						:on-success="onUploadSuccess"
						:action="'http://localhost:8202/admin/cmn/dict/importData'"
						class="upload-demo"
					>
						<el-button
							size="small"
							type="primary"
						>点击上传</el-button>
						<div
							slot="tip"
							class="el-upload__tip"
						>
							只能上传xls文件,且不超过500kb
						</div>
					</el-upload>
				</el-form-item>
			</el-form>
			<div
				slot="footer"
				class="dialog-footer"
			>
				<el-button @click="dialogImportVisible = false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import dictApi from '@/api/yygh/dict'
	export default {
	  data() {
	    return {
	      list: [],
	      dialogImportVisible: false
	    }
	  },
	  created() {
	    this.getData(1)
	  },
	  methods: {
	    // 获取数据
	    getData(id) {
	      dictApi.findChildDateByParentId(id).then((response) => {
	        this.list = response.data.list
	      })
	    },

	    load(node, treeNode, resolve) {
	      // 加载子节点
	      dictApi.findChildDateByParentId(node.id).then((response) => {
	        resolve(response.data.list)
	      })
	    },

	    // 导出数据
	    exportData() {
	      window.open('http://localhost:8202/admin/cmn/dict/exportData')
	    },

	    // 导入数据
	    importData() {
	      this.dialogImportVisible = true
	    },

	    onUploadSuccess(response, file) {
	      this.$message({
	        message: '上传成功',
	        center: true,
	        type: 'success',
	        duration: 2000
	      })
	      this.dialogImportVisible = false
	      this.getData(1)
	    }
	  }
	}
</script>
