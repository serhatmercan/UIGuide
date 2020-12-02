FUNCTION ZSM_UI_FNC_006.
*"----------------------------------------------------------------------
*"*"Local Interface:
*"  IMPORTING
*"     VALUE(IP_ID) TYPE  ID
*"     VALUE(IP_GUID) TYPE  GUID_32
*"----------------------------------------------------------------------

  DELETE FROM zsm_ui_tbl_002
    WHERE id   EQ ip_id
      AND guid EQ ip_guid.

ENDFUNCTION.