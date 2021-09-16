  METHOD documentset_get_entityset.
    TRY.
        CALL METHOD super->documentset_get_entityset
          EXPORTING
            iv_entity_name           = iv_entity_name
            iv_entity_set_name       = iv_entity_set_name
            iv_source_name           = iv_source_name
            it_filter_select_options = it_filter_select_options
            is_paging                = is_paging
            it_key_tab               = it_key_tab
            it_navigation_path       = it_navigation_path
            it_order                 = it_order
            iv_filter_string         = iv_filter_string
            iv_search_string         = iv_search_string
            io_tech_request_context  = io_tech_request_context
          IMPORTING
            et_entityset             = et_entityset
            es_response_context      = es_response_context.

        LOOP AT et_entityset ASSIGNING FIELD-SYMBOL(<fs_data>).
          <fs_data>-url = |/sap/opu/odata/sap/ZPP_008_COLOR_WORKING_SRV/ColorCodeSet('{ <fs_data>-id }')/Documents('{ <fs_data>-guid }')/$value|.
        ENDLOOP.
      CATCH /iwbep/cx_mgw_busi_exception.
      CATCH /iwbep/cx_mgw_tech_exception.
    ENDTRY.
  ENDMETHOD.