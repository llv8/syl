$(function() {
  syl.resp = {
    applygroup: function(data) {
      syl.util.ajax_mask_resp(data);
    },
    register: function(data) {
      syl.util.ajax_mask_resp(data, function(data) {
        if (data.l == 1) {
          syl.util.clear_storage();
          syl.util.update_stat(data.u);
          syl.util.set_obj('u', data.u);
        }
      });
    },
    login: function(data) {
      syl.util.ajax_mask_resp(data, function(data) {
        if (data.l == 1) {
          syl.util.clear_storage();
          syl.util.update_stat(data.u);
          syl.util.set_obj('u', data.u);
        }
      });
    },
    logout: function(data) {
      syl.util.clear_storage();
      syl.util.update_stat(null);
      syl.util.mask_empty();
      syl.ws.close();
    },

    addgroup: function(data) {
      syl.util.ajax_mask_resp(data);
    },

    approveuser: function(data) {
      syl.util.ajax_mask_resp(data);
      if (data.l == 1) {
        var aul = syl.util.get_obj('aul');
        delete aul[data.uid];
        syl.util.set_obj('aul', aul);
      }
    },

    vcode: function(data) {
      syl.util.ajax_mask_resp(data, function(data) {
        if (data.l == 1) {
          syl.util.set_obj('u', data.u);
          syl.util.update_stat(data.u);
          syl.util.interalrefresh();
          syl.ws.heart_beat();
        }
      });
    }
  }
});
