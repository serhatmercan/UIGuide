  METHOD download_attachment.

    DATA: ls_key    TYPE LINE OF /iwbep/t_mgw_name_value_pair,
          ls_header TYPE ihttpnvp,
          ls_stream TYPE ty_s_media_resource.

    DATA: lv_id   TYPE id,
          lv_guid TYPE guid_32,
          ls_data TYPE zsm_ui_str_002.

    READ TABLE it_key_tab INTO ls_key WITH KEY name = 'Id'.
    IF sy-subrc EQ 0.
      lv_id = ls_key-value.
    ENDIF.

    READ TABLE it_key_tab INTO ls_key WITH KEY name = 'Guid'.
    IF sy-subrc EQ 0.
      lv_guid = ls_key-value.
    ENDIF.

    CALL FUNCTION 'ZSM_UI_FNC_005'
      EXPORTING
        ip_id   = lv_id
        ip_guid = lv_guid
      IMPORTING
        es_data = ls_data.

    ls_stream-mime_type = ls_data-mimetype.
    ls_stream-value     = ls_data-value.

    ls_header-name = 'Content-Disposition'.
    CONCATENATE 'attachment; filename="'
                ls_data-filename '"'
           INTO ls_header-value.
    set_header( is_header = ls_header ).

    copy_data_to_ref(
      EXPORTING
        is_data = ls_stream
      CHANGING
        cr_data = er_stream
    ).

  ENDMETHOD.