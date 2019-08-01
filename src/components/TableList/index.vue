<template>
  <div class="table-list-component">
    <slot name="header"></slot>
    <el-table
      v-loading="tableLoading"
      :data="newTableData"
      :border="tableBorder"
      :stripe="tableStripe"
      :max-height="maxHeight">
      <template v-for="(config, index) of newTableColumnConfig">
        <table-tree-column
          v-if="config.columnType === 'tree' && config.showCurrentColumn"
          :key="'tree' + index"
          :tableData="newTableData"
          :prop="config.prop"
          :label="config.label"
          :width="config.width"
          :fixed="config.fixed"
          :treeKey="config.treeKey"
          :parentKey="config.parentKey"
          :levelKey="config.levelKey"
          :childKey="config.childKey">
        </table-tree-column>

        <el-table-column
          v-else-if="config.showCurrentColumn"
          :key="'column' + index"
          :prop="config.prop"
          :label="config.label"
          :align="config.align"
          :header-align="config.headerAlign"
          :width="config.width"
          :min-width="config.minWidth"
          :fixed="config.fixed">
          <template v-slot="scope">
            <table-render-column
              v-if="handleIsShowRenderColumn(config)"
              :scope="scope"
              :column-config="config"/>

            <span v-else>
              {{scope.row[config.prop]}}
            </span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        v-if="customHeader"
        :render-header="handleRenderHeader"
        width="50px"
        align="center">
      </el-table-column>
    </el-table>

    <div class="pagination-wrap">
      <slot name="footer" />
      <el-pagination
        :current-page="pages.currentPage"
        :page-size="pages.pageSize"
        :total="pages.total"
        :page-sizes="pageSizes"
        :layout="layout"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @prev-click="handleCurrentChange"
        @next-click="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
import TableTreeColumn from './TableTreeColumn'
import TableRenderColumn from './TableRenderColumn'
import TableCustomHeader from './TableCustomHeader'
export default {
  name: 'TableList',
  components: { TableTreeColumn, TableRenderColumn },
  props: {
    tableLoading: {
      type: Boolean,
      default: false,
    },
    tableData: {
      type: Array,
      default () { return [] }
    },
    tableColumnConfig: {
      type: Array,
      default () { return [] }
    },
    tableStripe: { // 斑马纹
      type: Boolean,
      default: false,
    },
    tableBorder: { // table边框
      type: Boolean,
      default: true
    },
    maxHeight: {
      type: [String, Number],
      default: 'auto'
    },
    customHeader: { // 自定义表头
      type: Boolean,
      default: false
    },
    pages: {
      type: Object,
      default () {
        return {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      }
    },
    pageSizes: {
      type: Array,
      default () { return [10, 20, 50, 100, 200] }
    },
    layout: {
      type: String,
      default: "total, sizes, prev, pager, next"
    },
    queryTableListFn: { // 查询table数据函数
      type: String,
      default: 'handleQueryTableList'
    }
  },
  computed: {
    newTableData () {
      return this.tableData
    },
    newTableColumnConfig () {
      let tableColumnConfig = this.tableColumnConfig
      tableColumnConfig.forEach(c => (this.$set(c, 'showCurrentColumn', true))) // 设置是否显示列
      return tableColumnConfig
    }
  },
  mounted () {
    console.log(this.tableColumnConfig)
  },
  methods: {
    // 是否渲染renderColumn组件
    handleIsShowRenderColumn (config) {
      return config.render && typeof config.render === 'function'
    },
    // 是否存在初始化查询table表格方法
    handleHasTableQueryList () {
      return this.$parent && this.$parent[this.queryTableListFn] && typeof this.$parent[this.queryTableListFn] === 'function'
    },
    // pageSize 改变时会触发
    handleSizeChange (size) {
      this.pages.pageSize = size
      if (this.handleHasTableQueryList()) {
        this.$parent[this.queryTableListFn]()
      } else {
        this.$emit('size-change', size)
      }
    },
    // currentPage 改变时会触发
    handleCurrentChange (page) {
      this.pages.currentPage = page
      if (this.handleHasTableQueryList()) {
        this.$parent[this.queryTableListFn]()
      } else {
        this.$emit('current-change', page)
      }
    },
    // 列表标题Label渲染
    handleRenderHeader (h) {
      return h(
        TableCustomHeader,
        {
          props: {
            tableColumnConfig: this.newTableColumnConfig
          }
        }
      )
    },
  }
}
</script>

<style lang="scss">
.table-list-component {
  width: 100%;
  margin:0 auto;
  padding: 20px;
  background:#fff;
  box-sizing: border-box;
  .el-table {
    width: 100%;
    margin-top: 10px;
    th {
      background-color: #f2f4f5;
      border-right: #f2f4f5;
      > .cell {
        color: #333;
      }
    }
    td {
      height: 50px;
      padding: 0;
    }
  }

  .pagination-wrap {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 20px;
    .el-pagination {
      flex: 1;
      text-align: right;
    }
  }
}
</style>

