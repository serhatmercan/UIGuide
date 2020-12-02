" var oData = {},
"	  oParams = {};
 
" oData.Values = [];

" for (var i = 0; i < aData.length; i++) {
"	oData.Values.push(aData[i]);
" }

" this.getModel().create("/DataSet", oData, oParams);
 
  METHOD /iwbep/if_mgw_appl_srv_runtime~create_deep_entity.

    CASE iv_entity_set_name.
	
      WHEN 'DataSet'.
      
        CALL METHOD me->create_data
          EXPORTING
            iv_entity_name          = iv_entity_name
            iv_entity_set_name      = iv_entity_set_name
            iv_source_name          = iv_source_name
            io_data_provider        = io_data_provider
            it_key_tab              = it_key_tab
            it_navigation_path      = it_navigation_path
            io_expand               = io_expand
            io_tech_request_context = io_tech_request_context
          IMPORTING
            er_deep_entity          = er_deep_entity.
            
    ENDCASE.
   
  ENDMETHOD.  
  
  METHOD create_data.

    DATA: lo_dp_facade   TYPE REF TO /iwbep/if_mgw_dp_facade,
          lv_destination TYPE rfcdest,
          lt_messages    TYPE bapiret2_t.

    DATA: BEGIN OF ls_data.
            INCLUDE TYPE zcl_zui_mpc=>ts_data.										" Main   => ID
    DATA:   values TYPE STANDARD TABLE OF zcl_zui_mpc=>ts_datac WITH DEFAULT KEY,	" Create => Items ; Values => Navigation Properties
          END OF ls_data.

    lo_dp_facade   = /iwbep/if_mgw_conv_srv_runtime~get_dp_facade( ).
    lv_destination = /iwbep/cl_sb_gen_dpc_rt_util=>get_rfc_destination( io_dp_facade = lo_dp_facade ).

    io_data_provider->read_entry_data(
      IMPORTING
        es_data = ls_data
    ).

    CALL FUNCTION 'ZUI_FAT_ONAY_F004' 
      DESTINATION lv_destination
      TABLES
        it_data   = ls_data-values
        et_return = lt_messages.

    IF lt_messages IS NOT INITIAL.
      me->/iwbep/if_sb_dpc_comm_services~rfc_save_log(
        EXPORTING
          iv_entity_type = iv_entity_name
          it_return      = lt_messages
          it_key_tab     = it_key_tab
      ).
    ENDIF.

    copy_data_to_ref(
      EXPORTING
        is_data = ls_data
      CHANGING
        cr_data = er_deep_entity
    ).

  ENDMETHOD.