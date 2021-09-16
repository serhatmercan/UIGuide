  method /iwbep/if_mgw_appl_srv_runtime~get_stream.

    DATA: lv_mimetype type nte_mimetype,
          lv_content  type xstring,
          lv_filename type rsbfilename,
          ls_meta     type sfpmetadata,
          lt_return   type bapiret2_t.

    try.
        case io_tech_request_context->get_entity_type_name( ).
          when 'Document'.

            data: lv_guid      type guid_32,
                  ls_file_data type zpp_008_s_file_show.

            lv_guid = value #( it_navigation_path[ 1 ]-key_tab[ name = 'Guid' ]-value  optional ).

            call function 'ZPP_008_DOSYA_GOSTER'
              exporting
                iv_guid      = lv_guid
              importing
                es_file_data = ls_file_data.

            lv_mimetype = ls_file_data-mimetype.
            lv_content  = ls_file_data-file_content.
            lv_filename = ls_file_data-file_name.
            data(lv_outtype) = 'attachment'.

          when 'ColorPrintout'.

            data: lt_request type table of zpp_008_s_istek_no,
                  lv_request type string.

            lv_request = value #( it_key_tab[ name = 'ID' ]-value  optional ).

            split lv_request at '-' into table lt_request.

            call function 'ZPP_008_RENK_CIKTI'
              importing
                ev_pdf      = lv_content
              tables
                it_istek_no = lt_request
                et_return   = lt_return.

            lv_mimetype = 'application/pdf'.
            lv_filename = 'Renk çıktısı'.
            lv_outtype = 'inline'.

            try.
                data(lo_fp) = cl_fp=>get_reference( ).
                data(lo_pdfobj) = lo_fp->create_pdf_object( connection = 'ADS' ).
                lo_pdfobj->set_document( pdfdata = lv_content ).
                ls_meta-title = lv_filename.

                lo_pdfobj->set_metadata( metadata = ls_meta ).
                lo_pdfobj->execute( ).
                lo_pdfobj->get_document( importing pdfdata = lv_content ).
              catch cx_fp_runtime_internal
                    cx_fp_runtime_system
                    cx_fp_runtime_usage into data(lx_fpex).
            endtry.

        endcase.
      catch cx_root.
        raise exception type /iwbep/cx_mgw_tech_exception.
    endtry.

    data(ls_stream) = value ty_s_media_resource( mime_type = lv_mimetype value = lv_content ).

    me->set_header( value #( name = 'Content-Disposition' value = |{ lv_outtype }; filename="{ escape( val = lv_filename format = cl_abap_format=>e_url ) }"| ) ).
    me->copy_data_to_ref( exporting is_data = ls_stream changing cr_data = er_stream ).

  endmethod.