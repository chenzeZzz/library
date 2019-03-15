<template>
    <div class="books-container container">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/books' }">图书管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-tabs v-model="tabActive"
            @tab-click="tabChange">
            <el-tab-pane label="馆存"
                name="store">
                <div class="header">
                    <el-select v-model="status"
                        placeholder="筛选"
                        @change="filterChange">
                        <el-option v-for="item in bookStatus"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-input v-model="keyStore"
                        prefix-icon="el-icon-search"
                        autofocus
                        placeholder="请输入图书名字进行搜索"
                        clearable></el-input>
                    <el-button type="primary"
                        plain
                        @click="searchStore">搜索</el-button>
                </div>
                <div class="content">
                    <el-table :data="bookData"
                        stripe
                        style="width: 100%"
                        v-loading="loading"
                        element-loading-text="拼命加载中"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.8)"
                        refs="onshelfTable">
                        <el-table-column label="封面"
                            width="120">
                            <template slot-scope="scope">
                                <img :src="scope.row.image"
                                    width="80"
                                    alt="图书封面">
                            </template>
                        </el-table-column>
                        <el-table-column prop="title"
                            label="书名">
                        </el-table-column>
                        <el-table-column prop="author"
                            label="作者">
                        </el-table-column>
                        <el-table-column prop="press"
                            label="出版社">
                        </el-table-column>
                        <el-table-column prop="description"
                            label="简介"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column width="80"
                            label="操作">
                            <template slot-scope="scope">
                                <el-button
                                    type="text"
                                    @click="offshelf(scope.row.id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :page-count="totalPages"
                        @prev-click="this.prev"
                        @current-change="this.pager"
                        @next-click="this.next"
                        >
                    </el-pagination>
                </div>
            </el-tab-pane>

            <el-tab-pane label="录入"
                name="recording">
                <div class="header">
                    <el-input v-model="key"
                        prefix-icon="el-icon-search"
                        autofocus
                        placeholder="请输入图书名字进行搜索"
                        clearable></el-input>
                    <el-button type="primary"
                        plain
                        @click="search">搜索</el-button>
                </div>
                <div class="content">
                    <el-table :data="recordList"
                        stripe
                        style="width: 100%"
                        v-loading="loading"
                        element-loading-text="拼命加载中"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.8)">
                        <el-table-column label="封面"
                            width="120">
                            <template slot-scope="scope">
                                <img :src="scope.row.image"
                                    width="80"
                                    alt="图书封面">
                            </template>
                        </el-table-column>
                        <el-table-column prop="title"
                            label="书名">
                        </el-table-column>
                        <el-table-column prop="author"
                            label="作者">
                        </el-table-column>
                        <el-table-column prop="publisher"
                            label="出版社">
                        </el-table-column>
                        <el-table-column prop="summary"
                            label="简介"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column width="120"
                            label="操作">
                            <template slot-scope="scope">
                                <el-button type="text"
                                    @click="openDialog(scope.row)">录入</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
            <el-dialog title="书籍信息" :visible.sync="dialogTableVisible">
                <el-form :model="currTempl">
                    <el-form-item label="图书封面" v-model="currTempl.image" :label-width="formLabelWidth">
                    <!-- <img :src="currTempl.image"
                                    width="180"
                                    alt="图书封面"> -->
                        <el-upload
                            class="upload-demo"
                            action="nouse"
                            :before-upload='beforUpload0'
                            multiple: false
                            :limit="1">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="书名" :label-width="formLabelWidth">
                        <el-input v-model="currTempl.title" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="作者" :label-width="formLabelWidth">
                        <el-input v-model="currTempl.author" autocomplete="off"></el-input>                        
                    </el-form-item>
                    <el-form-item label="类型" prop="type" :label-width="formLabelWidth">
                        <el-select v-model="currTempl.type"
                            placeholder="选择类型"
                            >
                            <el-option v-for="item in bookStatus"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                     <el-form-item label="出版社" :label-width="formLabelWidth">
                        <el-input v-model="currTempl.press" autocomplete="off"></el-input>                        
                    </el-form-item>
                     <el-form-item label="简介" :label-width="formLabelWidth">
                        <el-input type="textarea" v-model="currTempl.desc" autocomplete="off"></el-input>                        
                    </el-form-item>
                    <el-form-item label="上传"  :label-width="formLabelWidth">
                        <el-upload
                            class="upload-demo"
                            action="nouse"
                            :before-upload='beforUpload1'
                            multiple: false
                            :limit="1">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                        <!-- <el-upload
                            v-model="currTempl.file"
                            class="upload-demo"
                            drag
                            action="nouse"
                            auto-upload: false
                            :before-upload='beforUpload'
                            :on-success='uploadsuccess'
                            multiple>
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip" slot="tip">不超过500kb</div>
                        </el-upload>                        -->
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogTableVisible = false">取 消</el-button>
                    <el-button type="primary" @click="record">确 定</el-button>
                </div>
            </el-dialog>
        </el-tabs>
    </div>
</template>
<script>
import Store from 'store2'
import { Loading } from '../assets/js/mixins'
import { api } from '@/config'

export default {
    name: 'books',
    mixins: [Loading],
    data() {
        return {
            tabActive: 'store',
            user: {},
            currBookTypeId: '',
            pageNum: 1,
            totalPages: 2,
            key: '',
            keyStore: '',
            recordList: [],
            bookData: [],
            bookStatus: [
                {
                    id: 0,
                    name: '未选择'
                }
            ],
            status: 0,
            dialogTableVisible: false,
            currTempl: {},
            formLabelWidth: '120px'
        }
    },
    methods: {
        tabChange() {
            if (this.tabActive === 'store') {
                this.$nextTick(() => {
                    this.getBookData()
                })
            }
        },
        filterChange(id) {
            this.currBookTypeId = id
            this.getBookData()
        },
        search() {
            this.showLoading()
            this.http.get(`/api/v2/book/search?q=${this.key}`)
                .then(res => {
                    if (res.status === 200 && res.data.books.length !== 0) {
                        console.log(res.data.books)
                        console.log(res.data)
                        
                        this.recordList = res.data.books
                    } else {
                        alert('查询失败')
                    }
                    this.hideLoading()
                })
        },

        searchStore() {
            console.log('keyStore===', this.keyStore)
            if (this.keyStore === '') {
                this.$message.error('请输入书名')
                return
            }
            this.pageNum = 1
            this.getBookData(this.pageNum)
        },

        openDialog(row) {
            this.currTempl = {}
            console.log('row===', row);

            this.dialogTableVisible = true
            this.currTempl.image = row.image
            this.currTempl.title = row.title
            this.currTempl.author = row.author.join(',')
            this.currTempl.press = row.publisher
            this.currTempl.desc = row.summary
            this.currTempl.code = row.isbn13 || row.isbn10
        },


        beforUpload0(file){
            console.log('beforUpload0===', file);
            this.currTempl.image = file
            return false
        },

        beforUpload1(file){
            console.log('beforUpload1===', file);
            this.currTempl.file = file
            return false
        },

        uploadsuccess(file){
            console.log('success===', file);
            this.currTempl.file = file
        },

        record(data) {
            console.log('data=====', this.currTempl);
            let fd = new FormData()
            for (const key in this.currTempl) {
                if (this.currTempl.hasOwnProperty(key)) {
                    const element = this.currTempl[key];
                    fd.append(key, element)
                }
            }
            this.http.post(`${api.Api}/upload`, fd)
                .then(res => {
                    if (res.status === 200) {
                        this.$message.success('录入成功')
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
                .catch(error => {
                    this.$message.error(error)
                })
        },

        prev() {
            this.pageNum--
            console.log('pre=======')
            this.getBookData(this.pageNum)
        },

        pager(pageIndex) {
            console.log('pageIndex====', pageIndex)
            this.pageNum = pageIndex
            this.getBookData(pageIndex)
        },

        next() {
            this.pageNum++
            console.log('pre=======')
            this.getBookData(this.pageNum)
        },

        getBookData(_pageNum) {
            this.showLoading()
            let _data = {
                userId: this.user.id,
                pageNum: _pageNum || 1,
                bookType: this.currBookTypeId || ''
            }
            if (this.keyStore !== '') {
                _data.bookTitle = this.keyStore
            }
            console.log('this._data=====', _data)
            this.http.post(`${api.bookApi}/search`, _data)
            .then(res => {
                console.log('res===', res)
                if (res.status === 200) {
                    const _data = res.data.result
                    _data.forEach(element => {
                        element.image = 'data:image/png;base64,' + element.bookImage
                    })
                    this.totalPages = res.data.totalPages
                    this.bookData = _data
                } else {
                    this.$message.error('查询失败')
                }
                this.hideLoading()
            }).catch(() => {
                this.hideLoading()
                this.$message.error('error')
            })
        },

        getBookType() {
            this.showLoading()
            this.http.get(`${api.bookTypeApi}/all`)
            .then(res => {
                console.log('getBookType res===', res)
                if (res.status === 200) {
                    const _data = res.data
                    this.bookStatus = this.bookStatus.concat(_data)
                } else {
                    this.$message.error('查询失败')
                }
                this.hideLoading()
            }).catch(() => {
                this.hideLoading()
                this.$message.error('error')
            })
        },

        refreshList() {
            this.getBookData(this.pageNum)
        },

        offshelf(bookId) {
            this.$confirm('是否确认删除该图书？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                bookId = Number(bookId)
                console.log(bookId);
                this.http.get(`${api.bookApi}/remove?bookId=${bookId}`)
                    .then(res => {
                        if (res.status === 200) {
                            this.$message.success('操作成功')
                            this.refreshList()
                        } else {
                            this.$message.success(`操作失败`)
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        }
    },
    created() {
        if (Store.get('isLogin') === 0) {
            this.$router.push('/login')
        }
    },
    mounted() {
        this.user = Store.get('user')
        this.getBookData()
        this.getBookType()
    }
}
</script>
<style lang="scss" scoped>

</style>
