# TWILIGHT method (MVP)
UTC is used internally. Solar azimuth follows NOAA convention (clockwise from north), elevation positive above horizon.

Core formulas:
- ENU solar vector: s_E = cos(e) sin(A), s_N = cos(e) cos(A), s_U = sin(e)
- Earth radius approximation: R = 6371 km
- Ground progression along cross-section: e_ground(x) = e_station - x / R (radians)
- Threshold ground projection: x_ground = R * (e_station - alpha)
- Horizon dip: delta(z) = arccos(R/(R+z))
- Threshold curve: x(z, alpha) = R * (e_station + delta(z) - alpha)

This is a geometric operational visualization, not a radiative-transfer brightness model.

- In this spherical tangent model, each threshold curve x(z, alpha) differs only by a horizontal translation in x for each alpha. Therefore, the local slope (and derived inclination angle) is identical at a given altitude across thresholds; at ground, the model reports ∠ground = 0.0°.
