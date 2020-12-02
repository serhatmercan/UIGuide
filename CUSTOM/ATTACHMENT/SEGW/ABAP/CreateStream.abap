  METHOD /iwbep/if_mgw_appl_srv_runtime~create_stream.

    CASE iv_entity_set_name.
      WHEN 'UploadAttachmentSet'.
        CALL METHOD me->upload_attachment
          EXPORTING
            iv_entity_name          = iv_entity_name
            is_media_resource       = is_media_resource
            it_key_tab              = it_key_tab
            iv_slug                 = iv_slug
            io_tech_request_context = io_tech_request_context
          IMPORTING
            er_entity               = er_entity.
    ENDCASE.

  ENDMETHOD.