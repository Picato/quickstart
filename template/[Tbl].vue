<template>
  <Page title="${Tbl} management" subtitle="Manage ${tbl} in project">
    <template slot="others">
      <PopupComponent title="${Tbl} Form" :show="action === 1">
        <template slot="body" v-if="action === 1">${$form}
        </template>
        <template slot="footer" v-if="item">
          <a class="button is-primary" @click="saveItem()" ref="submit">>
            <span class="icon">
              <i class="fa fa-floppy-o"></i>
            </span>
            <span>Save changes</span>
          </a>
          <a class="button is-text" @click="close()">
            <i class="fa fa-times"></i>&nbsp;Cancel
          </a>
        </template>
      </PopupComponent>
    </template>
    <template slot="main">
      <TableComponent>
        <template slot="pagination" v-if="list">
          <PaginationComponent :page="page" :recordsPerPage="[20, 50, 100]" :length="list.length" @change="fetchData"></PaginationComponent>
        </template>
        <template slot="head">
          <tr>
            <th width="1">#</th>
${$titleTable}
            <th width="1">
              <a class="button is-primary is-small" v-on:click="editItem()">
                <span class="icon is-small">
                  <i class="fa fa-plus-square-o"></i>
                </span>
                <span>Add</span>
              </a>
            </th>
          </tr>
        </template>
        <template slot="body" v-if="list">
          <tr v-for="(e, i) in list" :key="e._id">
            <th>{{(page - 1) * recordsPerPage + i + 1}}</th>
${$contentTable}
            <td>
              <div class="field has-addons">
                <p class="control">
                  <a class="button is-small is-info" @click="editItem(e)">
                    <span class="icon is-small">
                      <i class="fa fa-pencil-square-o"></i>
                    </span>
                    <span>Edit</span>
                  </a>
                </p>
                <p class="control">
                  <a class="button is-small is-dark" @click="removeItem(e._id)">
                    <span class="icon is-small">
                      <i class="fa fa-trash-o"></i>
                    </span>
                    <span>Delete</span>
                  </a>
                </p>
              </div>
            </td>
          </tr>
        </template>
      </TableComponent>
    </template>
  </Page>
</template>

<script>
import _ from 'lodash'
import { $find, $show, $date } from '@/filters/Core'
import Page from '@/components/template/Page'
import PopupComponent from '@/components/common/Popup'
import TableComponent from '@/components/common/Table'
import PaginationComponent from '@/components/common/Pagination'${$referImport}

export default {
  name: '${Tbl}Component',
  filters: { $find, $show, $date },
  components: { PopupComponent, Page, TableComponent, PaginationComponent },
  providers: ['${Tbl}'],
  data() {
    return {
      page: 1,
      recordsPerPage: 20,
      item: undefined,
      list: undefined${$referData}
    }
  },
  watch: {
    $route({ name }) {
      if (name === '${Tbl}') this.fetchData()
    }
  },
  mounted() {
    ${$referInit}this.fetchData(1)
  },
  methods: {
    async fetchData({ page, recordsPerPage } = {}) {
      if (page) this.page = page
      if (recordsPerPage) this.recordsPerPage = recordsPerPage
      this.list = await this.providers.${Tbl}.find(undefined, { page: this.page, recordsPerPage: this.recordsPerPage })
    },
    editItem(item = ${$dfValue}) {
      this.item = _.cloneDeep(item)
    },
    close(type) {
      this.item = undefined
      if (type) this.$pub('msg', { type: 1, msg: `${type} successfully` })
    },
    async saveItem() {
      const isValid = await this.$validator.validateAll()
      if (isValid) {
        if (!this.item._id) {
          await this.providers.${Tbl}.insert(this.item)
          await this.fetchData()
          this.close('Added')
        } else {
          await this.providers.${Tbl}.update(this.item)
          await this.fetchData()
          this.close('Updated')
        }
      }
    },
    async removeItem(id) {
      if (window.confirm('Are you sure to remove it ?')) {
        await this.providers.${Tbl}.delete(id)
        await this.fetchData()
        this.close('Deleted')
      }
    }
  }
}
</script>
