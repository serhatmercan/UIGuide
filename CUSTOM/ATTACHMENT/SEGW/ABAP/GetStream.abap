  METHOD /iwbep/if_mgw_appl_srv_runtime~get_stream.

    CASE iv_entity_set_name.
      WHEN 'PDFSet'.
        CALL METHOD me->pdf_display
          EXPORTING
            iv_entity_name          = iv_entity_name
            it_key_tab              = it_key_tab
            io_tech_request_context = io_tech_request_context
          IMPORTING
            er_stream               = er_stream
            es_response_context     = es_response_context.
      WHEN 'DownloadAttachmentSet'.
        CALL METHOD me->download_attachment
          EXPORTING
            iv_entity_name          = iv_entity_name
            it_key_tab              = it_key_tab
            io_tech_request_context = io_tech_request_context
          IMPORTING
            er_stream               = er_stream
            es_response_context     = es_response_context.
    ENDCASE.

  ENDMETHOD.