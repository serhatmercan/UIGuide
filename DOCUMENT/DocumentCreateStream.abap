  METHOD /iwbep/if_mgw_appl_srv_runtime~create_stream.

    IF iv_entity_name EQ 'Document'.

      DATA: lv_request_no TYPE zpp_000_e_067_v2,
            lv_filename   TYPE rsbfilename,
            lv_mimetype   TYPE nte_mimetype,
            lv_content    TYPE xstring,
            lt_import     TYPE zpp_008_tt_file_upload_import.

      lv_request_no = VALUE #( it_key_tab[ name = 'ID' ]-value OPTIONAL ) .
      lv_filename   = CONV rsbfilename( iv_slug ).
      lv_mimetype   = CONV nte_mimetype( is_media_resource-mime_type ).
      lv_content    = is_media_resource-value.

      SPLIT lv_filename AT '.' INTO TABLE DATA(lt_filename).
      READ TABLE lt_filename INTO DATA(lv_filetype) INDEX lines( lt_filename ).

      APPEND INITIAL LINE TO lt_import ASSIGNING FIELD-SYMBOL(<fs_import>).
      <fs_import>-istek_no      = lv_request_no.
      <fs_import>-dosya_tipi    = lv_filetype.
      <fs_import>-dosya_icerigi = lv_content.
      <fs_import>-mimetype      = lv_mimetype.
      <fs_import>-filename      = lv_filename.

      CALL FUNCTION 'ZPP_008_DOSYA_EKLE'
        EXPORTING
          it_import = lt_import.

    ENDIF.

  ENDMETHOD.