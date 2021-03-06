﻿/// <reference path="common.d.ts" />

import common from "./Common";
import userControl from "./UserControl";

/**
 * 标签管理
 * @type type
 */
let app: IAnyPropObject = {};

/**
 * 标签列表
 * @type type
 */
app.TagsList = {
    Init: function () {
        var _this = this;
        $("#btnUpdate").on("click", function () {
            return _this.Update();
        });
        $("#btnDel").on("click", function () {
            return _this.Del();
        })
    },
    /**
     * 返回已选择的value数组
     */
    GetSelectValue: function () {
        var selectVal = $(".XCLTableCheckAll").val();
        var ids = selectVal.split(',');
        if (selectVal && selectVal !== "" && ids.length > 0) {
            return ids;
        } else {
            return null;
        }
    },
    /**
     * 打开标签【修改】页面
     */
    Update: function () {
        var $btn = $("#btnUpdate"), ids = this.GetSelectValue();
        if (ids && ids.length === 1) {
            var query = {
                handletype: "update",
                TagsID: ids[0]
            }

            var url = XJ.Url.UpdateParam($btn.attr("href"), query);
            $btn.attr("href", url);
            return true;
        } else {
            art.dialog.tips("请选择一条记录进行修改操作！");
            return false;
        }
    },
    /**
     * 删除标签
     */
    Del: function () {
        var ids = this.GetSelectValue();
        if (!ids || ids.length == 0) {
            art.dialog.tips("请至少选择一条记录进行操作！");
            return false;
        }

        art.dialog.confirm("您确定要删除此信息吗？", function () {
            $.XGoAjax({
                target: $("#btnDel")[0],
                ajax: {
                    url: XCLCMSPageGlobalConfig.RootURL + "Tags/DelByIDSubmit",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    type: "POST"
                }
            });
        }, function () {
        });

        return false;
    }
};

/**
 * 标签添加与修改页
 */
app.TagsAdd = {
    /**
    * 输入元素
    */
    Elements: {
        Init: function () {
        }
    },
    Init: function () {
        var _this = this;
        _this.Elements.Init();
        _this.InitValidator();

        //商户号下拉框初始化
        userControl.MerchantSelect.Init({
            merchantIDObj: $("#txtMerchantID"),
            merchantAppIDObj: $("#txtMerchantAppID")
        });
    },
    /**
     * 表单验证初始化
     */
    InitValidator: function () {
        var validator = $("form:first").validate({
            rules: {
                txtTagName: {
                    required: true,
                    XCLCustomRemote: function () {
                        return {
                            url: XCLCMSPageGlobalConfig.RootURL + "Tags/IsExistTagName",
                            data: function () {
                                return {
                                    TagName: $("input[name='txtTagName']").val(),
                                    TagsID: $("input[name='TagsID']").val(),
                                    MerchantID: $("input[name='txtMerchantID']").val(),
                                    MerchantAppID: $("input[name='txtMerchantAppID']").val()
                                };
                            }
                        };
                    }
                },
                txtEmail: "email"
            }
        });
        common.BindLinkButtonEvent("click", $("#btnSave"), function () {
            if (!common.CommonFormValid(validator)) {
                return false;
            }
            $.XGoAjax({ target: $("#btnSave")[0] });
        });
    }
}
export default app;