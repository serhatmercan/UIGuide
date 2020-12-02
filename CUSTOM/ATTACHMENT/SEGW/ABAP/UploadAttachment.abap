  METHOD upload_attachment.

    DATA: lo_facade     TYPE REF TO /iwbep/cl_mgw_dp_facade,
          lt_header     TYPE tihttpnvp,
          ls_header     TYPE LINE OF tihttpnvp,
          ls_attachment TYPE zcl_zui_sm_prj_001_mpc=>ts_uploadattachment,
          lt_message    TYPE TABLE OF bapiret2.

    DATA: lv_id        TYPE id,
          lv_value     TYPE xstringval,
          lv_mimetype  TYPE char100,
          lv_filename  TYPE char100.

    lo_facade ?= /iwbep/if_mgw_conv_srv_runtime~get_dp_facade( ).
    lt_header = lo_facade->/iwbep/if_mgw_dp_facade~get_request_header( ).

    READ TABLE lt_header INTO ls_header WITH KEY name = 'id'.
    IF sy-subrc EQ 0.
      lv_id = ls_header-value.
    ENDIF.

    READ TABLE lt_header INTO ls_header WITH KEY name = 'filename'.
    IF sy-subrc EQ 0.
      CALL METHOD cl_http_utility=>unescape_url
        EXPORTING
          escaped   = ls_header-value
        RECEIVING
          unescaped = ls_header-value.
      lv_filename = ls_header-value.
    ENDIF.

    READ TABLE lt_header INTO ls_header WITH KEY name = 'content-length'.
    IF sy-subrc EQ 0.
      ls_attachment-length = ls_header-value.
    ENDIF.

    lv_mimetype = is_media_resource-mime_type.
    lv_value = is_media_resource-value.

    CALL FUNCTION 'ZSM_UI_FNC_003'
      EXPORTING
        ip_id             = lv_id
        ip_filename       = lv_filename
        ip_value          = lv_value
        ip_mimetype       = lv_mimetype.

    IF lt_message IS NOT INITIAL.
      me->/iwbep/if_sb_dpc_comm_services~rfc_save_log(
        EXPORTING
          iv_entity_type = iv_entity_name
          it_return      = lt_message
          it_key_tab     = it_key_tab ).
    ENDIF.

    copy_data_to_ref(
      EXPORTING
        is_data = ls_attachment
      CHANGING
        cr_data = er_entity
    ).

  ENDMETHOD.