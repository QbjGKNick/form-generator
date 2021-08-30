<template>
  <div class="right-board">
    <c-tabs v-model="currentTab" class="center-tabs">
      <c-tab-pane label="组件属性" name="field" />
      <c-tab-pane label="表单属性" name="form" />
    </c-tabs>
    <div class="field-box">
      <a
        class="document-link"
        target="_blank"
        :href="documentLink"
        title="查看组件文档"
      >
        <i class="el-icon-link"></i>
      </a>
      <c-scrollbar class="right-scrollbar">
        <!-- 组件属性 -->
        <c-form
          v-show="currentTab === 'field' && showField"
          size="small"
          label-width="90px"
        >
          <c-form-item v-if="activeData.__config__.changeTag" label="组件类型">
            <c-select
              v-model="activeData.__config__.tagIcon"
              placeholder="请选择组件类型"
              :style="{ width: '100%' }"
              @change="tagChange"
            >
              <c-option-group
                v-for="group in tagList"
                :key="group.label"
                :label="group.label"
              >
                <c-option
                  v-for="item in group.options"
                  :key="item.__config__.label"
                  :label="item.__config__.label"
                  :value="item.__config__.tagIcon"
                >
                  <svg-icon
                    class="node-icon"
                    :icon-class="item.__config__.tagIcon"
                  />
                  <span> {{ item.__config__.label }}</span>
                </c-option>
              </c-option-group>
            </c-select>
          </c-form-item>
          <c-form-item
            v-if="activeData.__vModel__ !== undefined"
            label="字段名"
          >
            <c-input
              v-model="activeData.__vModel__"
              placeholder="请输入字段名（v-model）"
            />
          </c-form-item>
          <c-form-item
            v-if="activeData.__config__.componentName !== undefined"
            label="组件名"
          >
            {{ activeData.__config__.componentName }}
          </c-form-item>
          <c-form-item
            v-if="activeData.__config__.label !== undefined"
            label="标题"
          >
            <c-input
              v-model="activeData.__config__.label"
              placeholder="请输入标题"
              @input="changeRenderKey"
            />
          </c-form-item>
          <c-form-item
            v-if="activeData.placeholder !== undefined"
            label="占位提示"
          >
            <c-input
              v-model="activeData.placeholder"
              placeholder="请输入占位提示"
              @input="changeRenderKey"
            />
          </c-form-item>
          <c-form-item
            v-if="activeData['start-placeholder'] !== undefined"
            label="开始占位"
          >
            <c-input
              v-model="activeData['start-placeholder']"
              placeholder="请输入占位提示"
            />
          </c-form-item>
          <c-form-item
            v-if="activeData['end-placeholder'] !== undefined"
            label="结束占位"
          >
            <c-input
              v-model="activeData['end-placeholder']"
              placeholder="请输入占位提示"
            />
          </c-form-item>
          <c-form-item
            v-if="activeData.__config__.span !== undefined"
            label="表单栅格"
          >
            <c-slider
              v-model="activeData.__config__.span"
              :max="24"
              :min="1"
              :marks="{ 12: '' }"
              @change="spanChange"
            />
          </c-form-item>
          <c-form-item
            v-if="
              activeData.__config__.layout === 'rowFormItem' &&
                activeData.gutter !== undefined
            "
            label="栅格间隔"
          >
            <c-input-number
              v-model="activeData.gutter"
              :min="0"
              placeholder="栅格间隔"
            />
          </c-form-item>
          <c-form-item
            v-if="
              activeData.__config__.layout === 'rowFormItem' &&
                activeData.type !== undefined
            "
            label="布局模式"
          >
            <c-radio-group v-model="activeData.type">
              <c-radio-button label="default" />
              <c-radio-button label="flex" />
            </c-radio-group>
          </c-form-item>
          <c-form-item
            v-if="
              activeData.justify !== undefined && activeData.type === 'flex'
            "
            label="水平排列"
          >
            <c-select
              v-model="activeData.justify"
              placeholder="请选择水平排列"
              :style="{ width: '100%' }"
            >
              <c-option
                v-for="(item, index) in justifyOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </c-select>
          </c-form-item>
          <c-form-item
            v-if="activeData.align !== undefined && activeData.type === 'flex'"
            label="垂直排列"
          >
            <c-radio-group v-model="activeData.align">
              <c-radio-button label="top" />
              <c-radio-button label="middle" />
              <c-radio-button label="bottom" />
            </c-radio-group>
          </c-form-item>
          <c-form-item
            v-if="activeData.__config__.labelWidth !== undefined"
            label="标签宽度"
          >
            <c-input
              v-model.number="activeData.__config__.labelWidth"
              type="number"
              placeholder="请输入标签宽度"
            />
          </c-form-item>
          <c-form-item
            v-if="activeData.style && activeData.style.width !== undefined"
            label="组件宽度"
          >
            <c-input
              v-model="activeData.style.width"
              placeholder="请输入组件宽度"
              clearable
            />
          </c-form-item>
          <c-form-item
            v-if="activeData.__vModel__ !== undefined"
            label="默认值"
          >
            <c-input
              :value="setDefaultValue(activeData.__config__.defaultValue)"
              placeholder="请输入默认值"
              @input="onDefaultValueInput"
            />
          </c-form-item>
          <c-form-item
            v-if="activeData.__config__.tag === 'c-checkbox-group'"
            label="至少应选"
          >
            <c-input-number
              :value="activeData.min"
              :min="0"
              placeholder="至少应选"
              @input="$set(activeData, 'min', $event ? $event : undefined)"
            />
          </c-form-item>
          <c-form-item
            v-if="activeData.__config__.tag === 'c-checkbox-group'"
            label="最多可选"
          >
            <c-input-number
              :value="activeData.max"
              :min="0"
              placeholder="最多可选"
              @input="$set(activeData, 'max', $event ? $event : undefined)"
            />
          </c-form-item>
          <c-form-item
            v-if="
              activeData.__slot__ && activeData.__slot__.prepend !== undefined
            "
            label="前缀"
          >
            <c-input
              v-model="activeData.__slot__.prepend"
              placeholder="请输入前缀"
            />
          </c-form-item>
          <c-form-item
            v-if="
              activeData.__slot__ && activeData.__slot__.append !== undefined
            "
            label="后缀"
          >
            <c-input
              v-model="activeData.__slot__.append"
              placeholder="请输入后缀"
            />
          </c-form-item>
          <c-form-item
            v-if="activeData['prefix-icon'] !== undefined"
            label="前图标"
          >
            <c-input
              v-model="activeData['prefix-icon']"
              placeholder="请输入前图标名称"
            >
              <c-button
                slot="append"
                icon="el-icon-thumb"
                @click="openIconsDialog('prefix-icon')"
              >
                选择
              </c-button>
            </c-input>
          </c-form-item>
          <c-form-item
            v-if="activeData['suffix-icon'] !== undefined"
            label="后图标"
          >
            <c-input
              v-model="activeData['suffix-icon']"
              placeholder="请输入后图标名称"
            >
              <c-button
                slot="append"
                icon="el-icon-thumb"
                @click="openIconsDialog('suffix-icon')"
              >
                选择
              </c-button>
            </c-input>
          </c-form-item>
          <c-form-item
            v-if="
              activeData['icon'] !== undefined &&
                activeData.__config__.tag === 'c-button'
            "
            label="按钮图标"
          >
            <c-input
              v-model="activeData['icon']"
              placeholder="请输入按钮图标名称"
            >
              <c-button
                slot="append"
                icon="el-icon-thumb"
                @click="openIconsDialog('icon')"
              >
                选择
              </c-button>
            </c-input>
          </c-form-item>
          <c-form-item
            v-if="activeData.__config__.tag === 'c-cascader'"
            label="选项分隔符"
          >
            <c-input
              v-model="activeData.separator"
              placeholder="请输入选项分隔符"
            />
          </c-form-item>
          <c-form-item
            v-if="activeData.autosize !== undefined"
            label="最小行数"
          >
            <c-input-number
              v-model="activeData.autosize.minRows"
              :min="1"
              placeholder="最小行数"
            />
          </c-form-item>
          <c-form-item
            v-if="activeData.autosize !== undefined"
            label="最大行数"
          >
            <c-input-number
              v-model="activeData.autosize.maxRows"
              :min="1"
              placeholder="最大行数"
            />
          </c-form-item>
          <c-form-item v-if="isShowMin" label="最小值">
            <c-input-number v-model="activeData.min" placeholder="最小值" />
          </c-form-item>
          <c-form-item v-if="isShowMax" label="最大值">
            <c-input-number v-model="activeData.max" placeholder="最大值" />
          </c-form-item>
          <c-form-item v-if="activeData.height !== undefined" label="组件高度">
            <c-input-number
              v-model="activeData.height"
              placeholder="高度"
              @input="changeRenderKey"
            />
          </c-form-item>
          <c-form-item v-if="isShowStep" label="步长">
            <c-input-number v-model="activeData.step" placeholder="步数" />
          </c-form-item>
          <c-form-item
            v-if="activeData.__config__.tag === 'c-input-number'"
            label="精度"
          >
            <c-input-number
              v-model="activeData.precision"
              :min="0"
              placeholder="精度"
            />
          </c-form-item>
          <c-form-item
            v-if="activeData.__config__.tag === 'c-input-number'"
            label="按钮位置"
          >
            <c-radio-group v-model="activeData['controls-position']">
              <c-radio-button label="">
                默认
              </c-radio-button>
              <c-radio-button label="right">
                右侧
              </c-radio-button>
            </c-radio-group>
          </c-form-item>
          <c-form-item
            v-if="activeData.maxlength !== undefined"
            label="最多输入"
          >
            <c-input
              v-model="activeData.maxlength"
              placeholder="请输入字符长度"
            >
              <template slot="append">
                个字符
              </template>
            </c-input>
          </c-form-item>
          <c-form-item
            v-if="activeData['active-text'] !== undefined"
            label="开启提示"
          >
            <c-input
              v-model="activeData['active-text']"
              placeholder="请输入开启提示"
            />
          </c-form-item>
          <c-form-item
            v-if="activeData['inactive-text'] !== undefined"
            label="关闭提示"
          >
            <c-input
              v-model="activeData['inactive-text']"
              placeholder="请输入关闭提示"
            />
          </c-form-item>
          <c-form-item
            v-if="activeData['active-value'] !== undefined"
            label="开启值"
          >
            <c-input
              :value="setDefaultValue(activeData['active-value'])"
              placeholder="请输入开启值"
              @input="onSwitchValueInput($event, 'active-value')"
            />
          </c-form-item>
          <c-form-item
            v-if="activeData['inactive-value'] !== undefined"
            label="关闭值"
          >
            <c-input
              :value="setDefaultValue(activeData['inactive-value'])"
              placeholder="请输入关闭值"
              @input="onSwitchValueInput($event, 'inactive-value')"
            />
          </c-form-item>
          <c-form-item
            v-if="
              activeData.type !== undefined &&
                'c-date-picker' === activeData.__config__.tag
            "
            label="时间类型"
          >
            <c-select
              v-model="activeData.type"
              placeholder="请选择时间类型"
              :style="{ width: '100%' }"
              @change="dateTypeChange"
            >
              <c-option
                v-for="(item, index) in dateOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </c-select>
          </c-form-item>
          <c-form-item v-if="activeData.name !== undefined" label="文件字段名">
            <c-input
              v-model="activeData.name"
              placeholder="请输入上传文件字段名"
            />
          </c-form-item>
          <c-form-item v-if="activeData.accept !== undefined" label="文件类型">
            <c-select
              v-model="activeData.accept"
              placeholder="请选择文件类型"
              :style="{ width: '100%' }"
              clearable
            >
              <c-option label="图片" value="image/*" />
              <c-option label="视频" value="video/*" />
              <c-option label="音频" value="audio/*" />
              <c-option label="excel" value=".xls,.xlsx" />
              <c-option label="word" value=".doc,.docx" />
              <c-option label="pdf" value=".pdf" />
              <c-option label="txt" value=".txt" />
            </c-select>
          </c-form-item>
          <c-form-item
            v-if="activeData.__config__.fileSize !== undefined"
            label="文件大小"
          >
            <c-input
              v-model.number="activeData.__config__.fileSize"
              placeholder="请输入文件大小"
            >
              <c-select
                slot="append"
                v-model="activeData.__config__.sizeUnit"
                :style="{ width: '66px' }"
              >
                <c-option label="KB" value="KB" />
                <c-option label="MB" value="MB" />
                <c-option label="GB" value="GB" />
              </c-select>
            </c-input>
          </c-form-item>
          <c-form-item v-if="activeData.action !== undefined" label="上传地址">
            <c-input
              v-model="activeData.action"
              placeholder="请输入上传地址"
              clearable
            />
          </c-form-item>
          <c-form-item
            v-if="activeData['list-type'] !== undefined"
            label="列表类型"
          >
            <c-radio-group v-model="activeData['list-type']" size="small">
              <c-radio-button label="text">
                text
              </c-radio-button>
              <c-radio-button label="picture">
                picture
              </c-radio-button>
              <c-radio-button label="picture-card">
                picture-card
              </c-radio-button>
            </c-radio-group>
          </c-form-item>
          <c-form-item
            v-if="
              activeData.type !== undefined &&
                activeData.__config__.tag === 'c-button'
            "
            label="按钮类型"
          >
            <c-select v-model="activeData.type" :style="{ width: '100%' }">
              <c-option label="primary" value="primary" />
              <c-option label="success" value="success" />
              <c-option label="warning" value="warning" />
              <c-option label="danger" value="danger" />
              <c-option label="info" value="info" />
              <c-option label="text" value="text" />
            </c-select>
          </c-form-item>
          <c-form-item
            v-if="activeData.__config__.buttonText !== undefined"
            v-show="'picture-card' !== activeData['list-type']"
            label="按钮文字"
          >
            <c-input
              v-model="activeData.__config__.buttonText"
              placeholder="请输入按钮文字"
            />
          </c-form-item>
          <c-form-item
            v-if="activeData.__config__.tag === 'c-button'"
            label="按钮文字"
          >
            <c-input
              v-model="activeData.__slot__.default"
              placeholder="请输入按钮文字"
            />
          </c-form-item>
          <c-form-item
            v-if="activeData['range-separator'] !== undefined"
            label="分隔符"
          >
            <c-input
              v-model="activeData['range-separator']"
              placeholder="请输入分隔符"
            />
          </c-form-item>
          <c-form-item
            v-if="activeData['picker-options'] !== undefined"
            label="时间段"
          >
            <c-input
              v-model="activeData['picker-options'].selectableRange"
              placeholder="请输入时间段"
            />
          </c-form-item>
          <c-form-item v-if="activeData.format !== undefined" label="时间格式">
            <c-input
              :value="activeData.format"
              placeholder="请输入时间格式"
              @input="setTimeValue($event)"
            />
          </c-form-item>
          <template
            v-if="
              ['c-checkbox-group', 'c-radio-group', 'c-select'].indexOf(
                activeData.__config__.tag
              ) > -1
            "
          >
            <c-divider>选项</c-divider>
            <draggable
              :list="activeData.__slot__.options"
              :animation="340"
              group="selectItem"
              handle=".option-drag"
            >
              <div
                v-for="(item, index) in activeData.__slot__.options"
                :key="index"
                class="select-item"
              >
                <div class="select-line-icon option-drag">
                  <i class="el-icon-s-operation"></i>
                </div>
                <c-input
                  v-model="item.label"
                  placeholder="选项名"
                  size="small"
                />
                <c-input
                  placeholder="选项值"
                  size="small"
                  :value="item.value"
                  @input="setOptionValue(item, $event)"
                />
                <div
                  class="close-btn select-line-icon"
                  @click="activeData.__slot__.options.splice(index, 1)"
                >
                  <i class="el-icon-remove-outline"></i>
                </div>
              </div>
            </draggable>
            <div style="margin-left: 20px;">
              <c-button
                style="padding-bottom: 0"
                icon="el-icon-circle-plus-outline"
                type="text"
                @click="addSelectItem"
              >
                添加选项
              </c-button>
            </div>
            <c-divider />
          </template>

          <template
            v-if="['c-cascader', 'c-table'].includes(activeData.__config__.tag)"
          >
            <c-divider>选项</c-divider>
            <c-form-item v-if="activeData.__config__.dataType" label="数据类型">
              <c-radio-group
                v-model="activeData.__config__.dataType"
                size="small"
              >
                <c-radio-button label="dynamic">
                  动态数据
                </c-radio-button>
                <c-radio-button label="static">
                  静态数据
                </c-radio-button>
              </c-radio-group>
            </c-form-item>

            <template v-if="activeData.__config__.dataType === 'dynamic'">
              <c-form-item label="接口地址">
                <c-input
                  v-model="activeData.__config__.url"
                  :title="activeData.__config__.url"
                  placeholder="请输入接口地址"
                  clearable
                  @blur="$emit('fetch-data', activeData)"
                >
                  <c-select
                    slot="prepend"
                    v-model="activeData.__config__.method"
                    :style="{ width: '85px' }"
                    @change="$emit('fetch-data', activeData)"
                  >
                    <c-option label="get" value="get" />
                    <c-option label="post" value="post" />
                    <c-option label="put" value="put" />
                    <c-option label="delete" value="delete" />
                  </c-select>
                </c-input>
              </c-form-item>
              <c-form-item label="数据位置">
                <c-input
                  v-model="activeData.__config__.dataPath"
                  placeholder="请输入数据位置"
                  @blur="$emit('fetch-data', activeData)"
                />
              </c-form-item>

              <template v-if="activeData.props && activeData.props.props">
                <c-form-item label="标签键名">
                  <c-input
                    v-model="activeData.props.props.label"
                    placeholder="请输入标签键名"
                  />
                </c-form-item>
                <c-form-item label="值键名">
                  <c-input
                    v-model="activeData.props.props.value"
                    placeholder="请输入值键名"
                  />
                </c-form-item>
                <c-form-item label="子级键名">
                  <c-input
                    v-model="activeData.props.props.children"
                    placeholder="请输入子级键名"
                  />
                </c-form-item>
              </template>
            </template>

            <!-- 级联选择静态树 -->
            <c-tree
              v-if="activeData.__config__.dataType === 'static'"
              draggable
              :data="activeData.options"
              node-key="id"
              :expand-on-click-node="false"
              :render-content="renderContent"
            />
            <div
              v-if="activeData.__config__.dataType === 'static'"
              style="margin-left: 20px"
            >
              <c-button
                style="padding-bottom: 0"
                icon="el-icon-circle-plus-outline"
                type="text"
                @click="addTreeItem"
              >
                添加父级
              </c-button>
            </div>
            <c-divider />
          </template>

          <c-form-item
            v-if="activeData.__config__.optionType !== undefined"
            label="选项样式"
          >
            <c-radio-group v-model="activeData.__config__.optionType">
              <c-radio-button label="default">
                默认
              </c-radio-button>
              <c-radio-button label="button">
                按钮
              </c-radio-button>
            </c-radio-group>
          </c-form-item>
          <c-form-item
            v-if="activeData['active-color'] !== undefined"
            label="开启颜色"
          >
            <c-color-picker v-model="activeData['active-color']" />
          </c-form-item>
          <c-form-item
            v-if="activeData['inactive-color'] !== undefined"
            label="关闭颜色"
          >
            <c-color-picker v-model="activeData['inactive-color']" />
          </c-form-item>

          <c-form-item
            v-if="
              activeData.__config__.showLabel !== undefined &&
                activeData.__config__.labelWidth !== undefined
            "
            label="显示标签"
          >
            <c-switch v-model="activeData.__config__.showLabel" />
          </c-form-item>
          <c-form-item
            v-if="activeData.branding !== undefined"
            label="品牌烙印"
          >
            <c-switch v-model="activeData.branding" @input="changeRenderKey" />
          </c-form-item>
          <c-form-item
            v-if="activeData['allow-half'] !== undefined"
            label="允许半选"
          >
            <c-switch v-model="activeData['allow-half']" />
          </c-form-item>
          <c-form-item
            v-if="activeData['show-text'] !== undefined"
            label="辅助文字"
          >
            <c-switch
              v-model="activeData['show-text']"
              @change="rateTextChange"
            />
          </c-form-item>
          <c-form-item
            v-if="activeData['show-score'] !== undefined"
            label="显示分数"
          >
            <c-switch
              v-model="activeData['show-score']"
              @change="rateScoreChange"
            />
          </c-form-item>
          <c-form-item
            v-if="activeData['show-stops'] !== undefined"
            label="显示间断点"
          >
            <c-switch v-model="activeData['show-stops']" />
          </c-form-item>
          <c-form-item v-if="activeData.range !== undefined" label="范围选择">
            <c-switch v-model="activeData.range" @change="rangeChange" />
          </c-form-item>
          <c-form-item
            v-if="
              activeData.__config__.border !== undefined &&
                activeData.__config__.optionType === 'default'
            "
            label="是否带边框"
          >
            <c-switch v-model="activeData.__config__.border" />
          </c-form-item>
          <c-form-item
            v-if="activeData.__config__.tag === 'c-color-picker'"
            label="颜色格式"
          >
            <c-select
              v-model="activeData['color-format']"
              placeholder="请选择颜色格式"
              :style="{ width: '100%' }"
              clearable
              @change="colorFormatChange"
            >
              <c-option
                v-for="(item, index) in colorFormatOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </c-select>
          </c-form-item>
          <c-form-item
            v-if="
              activeData.size !== undefined &&
                (activeData.__config__.optionType === 'button' ||
                  activeData.__config__.border ||
                  activeData.__config__.tag === 'c-color-picker' ||
                  activeData.__config__.tag === 'c-button')
            "
            label="组件尺寸"
          >
            <c-radio-group v-model="activeData.size">
              <c-radio-button label="medium">
                中等
              </c-radio-button>
              <c-radio-button label="small">
                较小
              </c-radio-button>
              <c-radio-button label="mini">
                迷你
              </c-radio-button>
            </c-radio-group>
          </c-form-item>
          <c-form-item
            v-if="activeData['show-word-limit'] !== undefined"
            label="输入统计"
          >
            <c-switch v-model="activeData['show-word-limit']" />
          </c-form-item>
          <c-form-item
            v-if="activeData.__config__.tag === 'c-input-number'"
            label="严格步数"
          >
            <c-switch v-model="activeData['step-strictly']" />
          </c-form-item>
          <c-form-item
            v-if="activeData.__config__.tag === 'c-cascader'"
            label="任选层级"
          >
            <c-switch v-model="activeData.props.props.checkStrictly" />
          </c-form-item>
          <c-form-item
            v-if="activeData.__config__.tag === 'c-cascader'"
            label="是否多选"
          >
            <c-switch v-model="activeData.props.props.multiple" />
          </c-form-item>
          <c-form-item
            v-if="activeData.__config__.tag === 'c-cascader'"
            label="展示全路径"
          >
            <c-switch v-model="activeData['show-all-levels']" />
          </c-form-item>
          <c-form-item
            v-if="activeData.__config__.tag === 'c-cascader'"
            label="可否筛选"
          >
            <c-switch v-model="activeData.filterable" />
          </c-form-item>
          <c-form-item
            v-if="activeData.clearable !== undefined"
            label="能否清空"
          >
            <c-switch v-model="activeData.clearable" />
          </c-form-item>
          <c-form-item
            v-if="activeData.__config__.showTip !== undefined"
            label="显示提示"
          >
            <c-switch v-model="activeData.__config__.showTip" />
          </c-form-item>
          <c-form-item
            v-if="activeData.__config__.tag === 'c-upload'"
            label="多选文件"
          >
            <c-switch v-model="activeData.multiple" />
          </c-form-item>
          <c-form-item
            v-if="activeData['auto-upload'] !== undefined"
            label="自动上传"
          >
            <c-switch v-model="activeData['auto-upload']" />
          </c-form-item>
          <c-form-item
            v-if="activeData.readonly !== undefined"
            label="是否只读"
          >
            <c-switch v-model="activeData.readonly" />
          </c-form-item>
          <c-form-item
            v-if="activeData.disabled !== undefined"
            label="是否禁用"
          >
            <c-switch v-model="activeData.disabled" />
          </c-form-item>
          <c-form-item
            v-if="activeData.__config__.tag === 'c-select'"
            label="能否搜索"
          >
            <c-switch v-model="activeData.filterable" />
          </c-form-item>
          <c-form-item
            v-if="activeData.__config__.tag === 'c-select'"
            label="是否多选"
          >
            <c-switch v-model="activeData.multiple" @change="multipleChange" />
          </c-form-item>
          <c-form-item
            v-if="activeData.__config__.required !== undefined"
            label="是否必填"
          >
            <c-switch v-model="activeData.__config__.required" />
          </c-form-item>

          <template v-if="activeData.__config__.layoutTree">
            <c-divider>布局结构树</c-divider>
            <c-tree
              :data="[activeData.__config__]"
              :props="layoutTreeProps"
              node-key="renderKey"
              default-expand-all
              draggable
            >
              <span slot-scope="{ node, data }">
                <span class="node-label">
                  <svg-icon
                    class="node-icon"
                    :icon-class="
                      data.__config__ ? data.__config__.tagIcon : data.tagIcon
                    "
                  />
                  {{ node.label }}
                </span>
              </span>
            </c-tree>
          </template>

          <template v-if="Array.isArray(activeData.__config__.regList)">
            <c-divider>正则校验</c-divider>
            <div
              v-for="(item, index) in activeData.__config__.regList"
              :key="index"
              class="reg-item"
            >
              <span
                class="close-btn"
                @click="activeData.__config__.regList.splice(index, 1)"
              >
                <i class="el-icon-close"></i>
              </span>
              <c-form-item label="表达式">
                <c-input v-model="item.pattern" placeholder="请输入正则" />
              </c-form-item>
              <c-form-item label="错误提示" style="margin-bottom:0">
                <c-input v-model="item.message" placeholder="请输入错误提示" />
              </c-form-item>
            </div>
            <div style="margin-left: 20px">
              <c-button
                icon="el-icon-circle-plus-outline"
                type="text"
                @click="addReg"
              >
                添加规则
              </c-button>
            </div>
          </template>
        </c-form>
        <!-- 表单属性 -->
        <c-form v-show="currentTab === 'form'" size="small" label-width="90px">
          <c-form-item label="表单名">
            <c-input
              v-model="formConf.formRef"
              placeholder="请输入表单名（ref）"
            />
          </c-form-item>
          <c-form-item label="表单模型">
            <c-input
              v-model="formConf.formModel"
              placeholder="请输入数据模型"
            />
          </c-form-item>
          <c-form-item label="校验模型">
            <c-input
              v-model="formConf.formRules"
              placeholder="请输入校验模型"
            />
          </c-form-item>
          <c-form-item label="表单尺寸">
            <c-radio-group v-model="formConf.size">
              <c-radio-button label="medium">
                中等
              </c-radio-button>
              <c-radio-button label="small">
                较小
              </c-radio-button>
              <c-radio-button label="mini">
                迷你
              </c-radio-button>
            </c-radio-group>
          </c-form-item>
          <c-form-item label="标签对齐">
            <c-radio-group v-model="formConf.labelPosition">
              <c-radio-button label="left">
                左对齐
              </c-radio-button>
              <c-radio-button label="right">
                右对齐
              </c-radio-button>
              <c-radio-button label="top">
                顶部对齐
              </c-radio-button>
            </c-radio-group>
          </c-form-item>
          <c-form-item label="标签宽度">
            <c-input
              v-model.number="formConf.labelWidth"
              type="number"
              placeholder="请输入标签宽度"
            />
          </c-form-item>
          <c-form-item label="栅格间隔">
            <c-input-number
              v-model="formConf.gutter"
              :min="0"
              placeholder="栅格间隔"
            />
          </c-form-item>
          <c-form-item label="禁用表单">
            <c-switch v-model="formConf.disabled" />
          </c-form-item>
          <c-form-item label="表单按钮">
            <c-switch v-model="formConf.formBtns" />
          </c-form-item>
          <c-form-item label="显示未选中组件边框">
            <c-switch v-model="formConf.unFocusedComponentBorder" />
          </c-form-item>
        </c-form>
      </c-scrollbar>
    </div>

    <treeNode-dialog
      :visible.sync="dialogVisible"
      title="添加选项"
      @commit="addNode"
    />
    <icons-dialog
      :visible.sync="iconsVisible"
      :current="activeData[currentIconModel]"
      @select="setIcon"
    />
  </div>
</template>

<script>
import { isArray } from "util";
import TreeNodeDialog from "@/views/index/TreeNodeDialog";
import { isNumberStr } from "@/utils/index";
import IconsDialog from "./IconsDialog";
import {
  inputComponents,
  selectComponents,
  layoutComponents
} from "@/components/generator/config";
import { saveFormConf } from "@/utils/db";

const dateTimeFormat = {
  date: "yyyy-MM-dd",
  week: "yyyy 第 WW 周",
  month: "yyyy-MM",
  year: "yyyy",
  datetime: "yyyy-MM-dd HH:mm:ss",
  daterange: "yyyy-MM-dd",
  monthrange: "yyyy-MM",
  datetimerange: "yyyy-MM-dd HH:mm:ss"
};

// 使changeRenderKey在目标组件改变时可用
const needRerenderList = ["tinymce"];

export default {
  components: {
    TreeNodeDialog,
    IconsDialog
  },
  props: ["showField", "activeData", "formConf"],
  data() {
    return {
      currentTab: "field",
      currentNode: null,
      dialogVisible: false,
      iconsVisible: false,
      currentIconModel: null,
      dateTypeOptions: [
        {
          label: "日(date)",
          value: "date"
        },
        {
          label: "周(week)",
          value: "week"
        },
        {
          label: "月(month)",
          value: "month"
        },
        {
          label: "年(year)",
          value: "year"
        },
        {
          label: "日期时间(datetime)",
          value: "datetime"
        }
      ],
      dateRangeTypeOptions: [
        {
          label: "日期范围(daterange)",
          value: "daterange"
        },
        {
          label: "月范围(monthrange)",
          value: "monthrange"
        },
        {
          label: "日期时间范围(datetimerange)",
          value: "datetimerange"
        }
      ],
      colorFormatOptions: [
        {
          label: "hex",
          value: "hex"
        },
        {
          label: "rgb",
          value: "rgb"
        },
        {
          label: "rgba",
          value: "rgba"
        },
        {
          label: "hsv",
          value: "hsv"
        },
        {
          label: "hsl",
          value: "hsl"
        }
      ],
      justifyOptions: [
        {
          label: "start",
          value: "start"
        },
        {
          label: "end",
          value: "end"
        },
        {
          label: "center",
          value: "center"
        },
        {
          label: "space-around",
          value: "space-around"
        },
        {
          label: "space-between",
          value: "space-between"
        }
      ],
      layoutTreeProps: {
        label(data, node) {
          const config = data.__config__;
          return data.componentName || `${config.label}: ${data.__vModel__}`;
        }
      }
    };
  },
  computed: {
    documentLink() {
      return (
        this.activeData.__config__.document ||
        "https://element.eleme.cn/#/zh-CN/component/installation"
      );
    },
    dateOptions() {
      if (
        this.activeData.type !== undefined &&
        this.activeData.__config__.tag === "c-date-picker"
      ) {
        if (this.activeData["start-placeholder"] === undefined) {
          return this.dateTypeOptions;
        }
        return this.dateRangeTypeOptions;
      }
      return [];
    },
    tagList() {
      return [
        {
          label: "输入型组件",
          options: inputComponents
        },
        {
          label: "选择型组件",
          options: selectComponents
        }
      ];
    },
    activeTag() {
      return this.activeData.__config__.tag;
    },
    isShowMin() {
      return ["c-input-number", "c-slider"].indexOf(this.activeTag) > -1;
    },
    isShowMax() {
      return (
        ["c-input-number", "c-slider", "c-rate"].indexOf(this.activeTag) > -1
      );
    },
    isShowStep() {
      return ["c-input-number", "c-slider"].indexOf(this.activeTag) > -1;
    }
  },
  watch: {
    formConf: {
      handler(val) {
        saveFormConf(val);
      },
      deep: true
    }
  },
  methods: {
    addReg() {
      this.activeData.__config__.regList.push({
        pattern: "",
        message: ""
      });
    },
    addSelectItem() {
      this.activeData.__slot__.options.push({
        label: "",
        value: ""
      });
    },
    addTreeItem() {
      ++this.idGlobal;
      this.dialogVisible = true;
      this.currentNode = this.activeData.options;
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class="custom-tree-node">
          <span>{node.label}</span>
          <span class="node-operation">
            <i
              on-click={() => this.append(data)}
              class="el-icon-plus"
              title="添加"
            ></i>
            <i
              on-click={() => this.remove(node, data)}
              class="el-icon-delete"
              title="删除"
            ></i>
          </span>
        </div>
      );
    },
    append(data) {
      if (!data.children) {
        this.$set(data, "children", []);
      }
      this.dialogVisible = true;
      this.currentNode = data.children;
    },
    remove(node, data) {
      this.activeData.__config__.defaultValue = []; // 避免删除时报错
      const { parent } = node;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    addNode(data) {
      this.currentNode.push(data);
    },
    setOptionValue(item, val) {
      item.value = isNumberStr(val) ? +val : val;
    },
    setDefaultValue(val) {
      if (Array.isArray(val)) {
        return val.join(",");
      }
      // if (['string', 'number'].indexOf(typeof val) > -1) {
      //   return val
      // }
      if (typeof val === "boolean") {
        return `${val}`;
      }
      return val;
    },
    onDefaultValueInput(str) {
      if (isArray(this.activeData.__config__.defaultValue)) {
        // 数组
        this.$set(
          this.activeData.__config__,
          "defaultValue",
          str.split(",").map(val => (isNumberStr(val) ? +val : val))
        );
      } else if (["true", "false"].indexOf(str) > -1) {
        // 布尔
        this.$set(this.activeData.__config__, "defaultValue", JSON.parse(str));
      } else {
        // 字符串和数字
        this.$set(
          this.activeData.__config__,
          "defaultValue",
          isNumberStr(str) ? +str : str
        );
      }
    },
    onSwitchValueInput(val, name) {
      if (["true", "false"].indexOf(val) > -1) {
        this.$set(this.activeData, name, JSON.parse(val));
      } else {
        this.$set(this.activeData, name, isNumberStr(val) ? +val : val);
      }
    },
    setTimeValue(val, type) {
      const valueFormat = type === "week" ? dateTimeFormat.date : val;
      this.$set(this.activeData.__config__, "defaultValue", null);
      this.$set(this.activeData, "value-format", valueFormat);
      this.$set(this.activeData, "format", val);
    },
    spanChange(val) {
      this.formConf.span = val;
    },
    multipleChange(val) {
      this.$set(this.activeData.__config__, "defaultValue", val ? [] : "");
    },
    dateTypeChange(val) {
      this.setTimeValue(dateTimeFormat[val], val);
    },
    rangeChange(val) {
      this.$set(
        this.activeData.__config__,
        "defaultValue",
        val ? [this.activeData.min, this.activeData.max] : this.activeData.min
      );
    },
    rateTextChange(val) {
      if (val) this.activeData["show-score"] = false;
    },
    rateScoreChange(val) {
      if (val) this.activeData["show-text"] = false;
    },
    colorFormatChange(val) {
      this.activeData.__config__.defaultValue = null;
      this.activeData["show-alpha"] = val.indexOf("a") > -1;
      this.activeData.__config__.renderKey = +new Date(); // 更新renderKey,重新渲染该组件
    },
    openIconsDialog(model) {
      this.iconsVisible = true;
      this.currentIconModel = model;
    },
    setIcon(val) {
      this.activeData[this.currentIconModel] = val;
    },
    tagChange(tagIcon) {
      let target = inputComponents.find(
        item => item.__config__.tagIcon === tagIcon
      );
      // eslint-disable-next-line
      if (!target)
        // eslint-disable-next-line
        target = selectComponents.find(
          item => item.__config__.tagIcon === tagIcon
        );
      this.$emit("tag-change", target);
    },
    changeRenderKey() {
      if (needRerenderList.includes(this.activeData.__config__.tag)) {
        this.activeData.__config__.renderKey = +new Date();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.right-board {
  width: 350px;
  position: absolute;
  right: 0;
  top: 0;
  padding-top: 3px;
  .field-box {
    position: relative;
    height: calc(100vh - 42px);
    box-sizing: border-box;
    overflow: hidden;
  }
  .el-scrollbar {
    height: 100%;
  }
}
.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;
  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }
  & .el-input + .el-input {
    margin-left: 4px;
  }
}
.select-item + .select-item {
  margin-top: 4px;
}
.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}
.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}
.option-drag {
  cursor: move;
}
.time-range {
  .el-date-editor {
    width: 227px;
  }
  ::v-deep .el-icon-time {
    display: none;
  }
}
.document-link {
  position: absolute;
  display: block;
  width: 26px;
  height: 26px;
  top: 0;
  left: 0;
  cursor: pointer;
  background: #409eff;
  z-index: 1;
  border-radius: 0 0 6px 0;
  text-align: center;
  line-height: 26px;
  color: #fff;
  font-size: 18px;
}
.node-label {
  font-size: 14px;
}
.node-icon {
  color: #bebfc3;
}
</style>
