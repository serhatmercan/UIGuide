  METHOD pdf_display.

    DATA: ls_key      TYPE LINE OF /iwbep/t_mgw_name_value_pair,
          ls_order    TYPE zcl_zui_sm_prj_001_mpc=>ts_pdf,
          ls_stream   TYPE ty_s_media_resource,
          ls_header   TYPE ihttpnvp,
          lv_mimetype TYPE w3conttype,
          lv_filename TYPE w3filename.

    READ TABLE it_key_tab INTO ls_key WITH KEY name = 'Id'.
    IF sy-subrc EQ 0.
      ls_order-id = ls_key-value.
    ENDIF.

    CALL FUNCTION 'ZSM_UI_FNC_002'
      EXPORTING
        ip_id       = ls_order-id
      IMPORTING
        ev_filename = lv_filename
        ev_mimetype = lv_mimetype
        ev_pdfdata  = ls_stream-value.

    ls_stream-mime_type = lv_mimetype.

    ls_header-name = 'Content-Disposition'.
    CONCATENATE 'attachment; filename="' lv_filename '"' INTO ls_header-value.
    set_header( is_header = ls_header ).

    copy_data_to_ref(
      EXPORTING
        is_data = ls_stream
      CHANGING
        cr_data = er_stream
        ).

  ENDMETHOD.