<template>
  <Page title="${Tbl} management" subtitle="Manage ${tbl} in project">
    <template slot="others">
      <ConfirmComponent :show="action === -1" title="Do you want to delete it ?" @yes="remove()" @no="item=undefined"></ConfirmComponent>
      <PopupComponent title="${Tbl} Form" :show="action === 1">
        <template slot="body" v-if="action === 1">${$form}
        </template>
        <template slot="footer" v-if="item">
          <a class="button is-primary" @click="save()">
            <span class="icon">
              <i class="fa fa-floppy-o"></i>
            </span>
            <span>Save changes</span>
          </a>
          <a class="button is-text" @click="closeUpdate()">
            <i class="fa fa-times"></i>&nbsp;Cancel
          </a>
        </template>
      </PopupComponent>
    </template>
    <template slot="main">
      <TableComponent>
        <template slot="pagination" v-if="list">
          <a class="pagination-previous" title="This is the first page" @click="page <= 1 ? null : fetchData(page - 1)" :disabled="page <= 1">Previous</a>
          <a class="pagination-next" @click="list.length < recordsPerPage ? null : fetchData(page + 1)" :disabled="list.length < recordsPerPage">Next page</a>
          <ul class="pagination-list">
            <li>
              <div class="field has-addons">
                <p class="control">
                  <a class="button is-static">
                    Page {{page}}
                  </a>
                </p>
                <p class="control">
                  <span class="select">
                    <select v-model="recordsPerPage" @change="fetchData(1)">
                      <option :value="20">Show 20 records</option>
                      <option :value="50">Show 50 records</option>
                      <option :value="100">Show 100 records</option>
                    </select>
                  </span>
                </p>
              </div>
            </li>
          </ul>
        </template>
        <template slot="head">
          <tr>
            <th width="1">#</th>
${$titleTable}
            <th width="1">
              <a class="button is-primary is-small" v-on:click="openUpdate()">
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
                  <a class="button is-small is-info" @click="openUpdate(e)">
                    <span class="icon is-small">
                      <i class="fa fa-pencil-square-o"></i>
                    </span>
                    <span>Edit</span>
                  </a>
                </p>
                <p class="control">
                  <a class="button is-small is-dark" @click="item=e._id">
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
import PopupComponent from '@/components/common/Popup.component'
import TableComponent from '@/components/common/Table.component'
import ConfirmComponent from '@/components/common/Confirm.component'
import ${Tbl}Provider from '@/providers/${Tbl}Provider'${$referImport}

export default {
  name: 'list',
  filters: { $find, $show, $date },
  components: { PopupComponent, ConfirmComponent, Page, TableComponent },
  data() {
    return {
      page: 1,
      recordsPerPage: 20,
      item: undefined,
      list: undefined${$referData}
    }
  },
  computed: {
    action() {
      return typeof this.item === 'object' ? 1 : (typeof this.item === 'string' ? -1 : 0)
    }
  },
  mounted() {
    ${$referInit}this.fetchData(1)
  },
  methods: {
    async fetchData(page = 1) {
      this.page = page
      this.list = await ${Tbl}Provider.find(undefined, { page: this.page, recordsPerPage: this.recordsPerPage })
    },
    openUpdate(item = ${$dfValue}) {
      this.item = _.cloneDeep(item)
    },
    closeUpdate(type) {
      this.item = undefined
      if (type) this.$pub('msg', { type: 1, msg: `${type} successfully` })
    },
    async save() {
      const isValid = await this.$validator.validateAll()
      if (isValid) {
        if (!this.item._id) {
          await ${Tbl}Provider.insert(this.item)
          await this.fetchData()
          this.closeUpdate('Added')
        } else {
          await ${Tbl}Provider.update(this.item)
          await this.fetchData()
          this.closeUpdate('Updated')
        }
      }
    },
    async remove() {
      await ${Tbl}Provider.delete(this.item)
      await this.fetchData()
      this.closeUpdate('Deleted')
    }
  }
}
</script>
