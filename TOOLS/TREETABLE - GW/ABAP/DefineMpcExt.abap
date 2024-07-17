METHOD define.

    super->define( ).
  
    DATA(lo_entity_type) = model->get_entity_type( iv_entity_name = 'TreeTable' ). " Tree Table Set Name => TreeTable
    DATA(ls_annotation_key) = /iwbep/if_ana_odata_types=>gcs_ana_odata_annotation_key.

    DATA(lt_annotations) = VALUE #( 
      ( iv_property_name = 'Node'   iv_key = ls_annotation_key-hierarchy_node_for )
      ( iv_property_name = 'Level'  iv_key = ls_annotation_key-hierarchy_level_for )
      ( iv_property_name = 'Parent' iv_key = ls_annotation_key-hierarchy_parent_node_for )
      ( iv_property_name = 'Drill'  iv_key = ls_annotation_key-hierarchy_drill_state_for )
    ).
  
    LOOP AT lt_annotations INTO DATA(ls_annotation).
      DATA(lo_property) = lo_entity_type->get_property( iv_property_name = ls_annotation-iv_property_name ).
      DATA(lo_annotation) = lo_property->/iwbep/if_mgw_odata_annotatabl~create_annotation( iv_annotation_namespace = /iwbep/if_mgw_med_odata_types=>gc_sap_namespace ).

      lo_annotation->add( iv_key = ls_annotation-iv_key iv_value = 'Node' ).
    ENDLOOP.
  
  ENDMETHOD.