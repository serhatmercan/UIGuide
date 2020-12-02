FUNCTION zsm_ui_fnc_005.
*"----------------------------------------------------------------------
*"*"Local Interface:
*"  IMPORTING
*"     VALUE(IP_ID) TYPE  ID
*"     VALUE(IP_GUID) TYPE  GUID_32
*"  EXPORTING
*"     VALUE(ES_DATA) TYPE  ZSM_UI_STR_002
*"----------------------------------------------------------------------

  SELECT SINGLE *
    FROM zsm_ui_tbl_002
    INTO CORRESPONDING FIELDS OF es_data
    WHERE id EQ ip_id
      AND guid EQ ip_guid.

ENDFUNCTION.