FUNCTION zsm_ui_fnc_002.
*"----------------------------------------------------------------------
*"*"Local Interface:
*"  IMPORTING
*"     VALUE(IP_ID) TYPE  CHAR8 OPTIONAL
*"  EXPORTING
*"     VALUE(EV_FILENAME) TYPE  W3FILENAME
*"     VALUE(EV_MIMETYPE) TYPE  W3CONTTYPE
*"     VALUE(EV_PDFDATA) TYPE  XSTRINGVAL
*"----------------------------------------------------------------------

  DATA ls_data TYPE zsm_ui_tbl_001.

  DATA: lt_lines      TYPE TABLE OF tline,
        lv_format     TYPE char10 VALUE 'PDF',
        lv_filesize   TYPE i,
        lv_formname   TYPE tdsfname,
        lv_fm_name    TYPE rs38l_fnam,
        ls_control    TYPE ssfctrlop,
        ls_output     TYPE ssfcompop,
        ls_job_output TYPE ssfcrescl.

  SELECT SINGLE *
    FROM zsm_ui_tbl_001
    INTO CORRESPONDING FIELDS OF ls_data
    WHERE id EQ ip_id.

  IF sy-subrc EQ 0.

    lv_formname = 'ZSM_UI_SF_001'.

    ls_control-no_dialog = 'X'.
    ls_control-getotf    = 'X'.

    ls_output-tddest = 'LP01'.

    CALL FUNCTION 'SSF_FUNCTION_MODULE_NAME'
      EXPORTING
        formname           = lv_formname
      IMPORTING
        fm_name            = lv_fm_name
      EXCEPTIONS
        no_form            = 1
        no_function_module = 2
        OTHERS             = 3.

    CALL FUNCTION lv_fm_name
      EXPORTING
        control_parameters = ls_control
        output_options     = ls_output
        user_settings      = 'X'
        is_data            = ls_data
      IMPORTING
        job_output_info    = ls_job_output
      EXCEPTIONS
        formatting_error   = 1
        internal_error     = 2
        send_error         = 3
        user_canceled      = 4
        OTHERS             = 5.

    CALL FUNCTION 'CONVERT_OTF'
      EXPORTING
        format                = lv_format
      IMPORTING
        bin_filesize          = lv_filesize
        bin_file              = ev_pdfdata
      TABLES
        otf                   = ls_job_output-otfdata
        lines                 = lt_lines
      EXCEPTIONS
        err_max_linewidth     = 1
        err_format            = 2
        err_conv_not_possible = 3
        err_bad_otf           = 4
        OTHERS                = 5.

    ev_mimetype = 'application/pdf'.

    CONCATENATE ls_data-id '_'
                ls_data-firstname '_'
                ls_data-lastname '.' lv_format INTO ev_filename.

    TRANSLATE ev_filename TO LOWER CASE.

  ENDIF.


ENDFUNCTION.