FUNCTION zsm_ui_fnc_003.
*"----------------------------------------------------------------------
*"*"Local Interface:
*"  IMPORTING
*"     VALUE(IP_ID) TYPE  ID
*"     VALUE(IP_FILENAME) TYPE  CHAR100
*"     VALUE(IP_VALUE) TYPE  XSTRINGVAL
*"     VALUE(IP_MIMETYPE) TYPE  CHAR100
*"----------------------------------------------------------------------

  DATA: ls_upload TYPE zsm_ui_tbl_002,
        lv_guid   TYPE guid_32.

  CALL FUNCTION 'GUID_CREATE'
    IMPORTING
      ev_guid_32 = lv_guid.

  ls_upload-mandt     = sy-mandt.
  ls_upload-id        = ip_id.
  ls_upload-guid      = lv_guid.
  ls_upload-filename  = ip_filename.
  ls_upload-value     = ip_value.
  ls_upload-mimetype  = ip_mimetype.
  ls_upload-datestamp = sy-datum.
  ls_upload-time      = sy-uzeit.

  INSERT zsm_ui_tbl_002 FROM ls_upload.
  IF sy-subrc <> 0.
    RAISE data_not_inserted.
  ENDIF.

ENDFUNCTION.