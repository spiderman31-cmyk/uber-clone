const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');

// Obtener perfil del usuario
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ user: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar perfil del usuario
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone, profileImage } = req.body;

    const { data, error } = await supabase
      .from('users')
      .update({
        name,
        phone,
        profile_image: profileImage,
        updated_at: new Date()
      })
      .eq('id', userId)
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: 'Perfil actualizado',
      user: data[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener historial de viajes
router.get('/:userId/history', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('rides')
      .select('*, drivers(name, rating)')
      .or(`passenger_id.eq.${userId},driver_id.eq.${userId}`)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ rides: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
