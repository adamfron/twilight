# TWILIGHT method (MVP)

**TWILIGHT** — *Terminator Web Interface for Local Inclination Geometry, Heights & Twilight* — is a client-side scientific visualization tool for exploring the local geometry of solar-terminator and twilight-threshold surfaces above a selected ground station.

The purpose of the tool is not to model sky brightness or atmospheric radiative transfer. It provides a geometric operational visualization of where different solar-elevation threshold surfaces intersect a local vertical cross-section.

---

## 1. Coordinate and time conventions

All calculations are performed internally in **UTC**.

Solar position uses the following convention:

- solar elevation, `e`, is positive above the local horizon;
- solar azimuth, `A`, is measured clockwise from geographic north;
- all angular formulas are evaluated in radians internally unless stated otherwise.

In displayed results, angles are converted to degrees.

The local coordinate system is an East-North-Up frame:

- `E` — east,
- `N` — north,
- `U` — up.

The local solar unit vector in ENU coordinates is

\[
s_E = \cos(e)\sin(A)
\]

\[
s_N = \cos(e)\cos(A)
\]

\[
s_U = \sin(e)
\]

The horizontal projection of the solar vector is

\[
\mathbf{p}_{day} =
\frac{(s_E, s_N)}{\sqrt{s_E^2+s_N^2}}
\]

This direction points horizontally toward the Sun, i.e. toward the daylight side.

---

## 2. Cross-section direction and terminator-front direction

The main cross-section is a local vertical plane:

- perpendicular to the ground,
- perpendicular to the local terminator front,
- aligned with the daylight-night direction.

The current UI convention is:

- negative x: toward daylight,
- positive x: toward night.

If solar azimuth is \(A\), the horizontal direction toward daylight is \(A\). Therefore, the positive x direction of the cross-section, pointing toward night, is

\[
A_{cross} = A + 180^\circ \pmod{360^\circ}
\]

The local terminator-front direction is perpendicular to the cross-section direction:

\[
A_{front} = A_{cross} + 90^\circ \pmod{360^\circ}
\]

These azimuths are displayed in the diagnostics and exported products.

---

## 3. Twilight thresholds

The application uses the standard solar-elevation threshold definitions:

| Threshold | Symbol | Solar elevation |
|---|---:|---:|
| Horizon / geometric terminator | \(\alpha_H\) | \(0^\circ\) |
| Civil twilight | \(\alpha_C\) | \(-6^\circ\) |
| Nautical twilight | \(\alpha_N\) | \(-12^\circ\) |
| Astronomical twilight | \(\alpha_A\) | \(-18^\circ\) |

In the equations below, the selected threshold is denoted as \(\alpha\).

---

## 4. Earth model

The MVP uses a spherical Earth approximation:

\[
R = 6371\ \mathrm{km}
\]

The selected station is treated as a local reference point on the spherical surface. The station altitude is stored and exported, but the current terminator-profile model uses the spherical radius approximation for the geometric cross-section.

This is sufficient for the intended visualization scale, but it is not a full WGS84 ellipsoidal ray-tracing model.

---

## 5. Ground displacement approximation

Let:

- \(x\) be horizontal distance from the station along the cross-section direction;
- \(x > 0\) point toward night;
- \(e_0\) be the solar elevation at the station.

For small-to-moderate local distances, the solar elevation at a ground point displaced by \(x\) is approximated as

\[
e_{ground}(x) = e_0 - \frac{x}{R}
\]

where \(e_0\) and \(x/R\) are in radians.

This means that moving toward night decreases the apparent solar elevation.

---

## 6. Ground intersection of a threshold

At ground level, a threshold line satisfies

\[
e_{ground}(x_g) = \alpha
\]

so

\[
e_0 - \frac{x_g}{R} = \alpha
\]

and therefore

\[
x_g = R(e_0-\alpha)
\]

where \(e_0\) and \(\alpha\) are in radians.

This value is reported as the **ground intersection distance**.

If \(x_g = 0\), the selected station lies directly on that threshold at ground level.

If \(x_g \neq 0\), the threshold line does not pass through the station at ground level at the selected time. In that case, the tool reports the projected ground intersection distance along the local cross-section.

---

## 7. Horizon dip with altitude

At altitude \(z\) above a spherical Earth, the geometric dip of the horizon is approximated as

\[
\delta(z) = \arccos\left(\frac{R}{R+z}\right)
\]

where:

- \(R\) and \(z\) must use the same units;
- in the application, both are in kilometres.

For small altitudes, this behaves approximately as

\[
\delta(z) \approx \sqrt{\frac{2z}{R}}
\]

This approximation explains the strong curvature of the plotted threshold profiles close to the ground.

---

## 8. Threshold curve in the vertical cross-section

At altitude \(z\), the threshold condition used by TWILIGHT is

\[
e_{ground}(x) + \delta(z) = \alpha
\]

Substituting the ground displacement approximation:

\[
e_0 - \frac{x}{R} + \delta(z) = \alpha
\]

Solving for \(x\):

\[
x(z,\alpha) = R\left(e_0 + \delta(z) - \alpha\right)
\]

This is the main profile equation used to draw the cross-section curves.

Each threshold curve is generated by evaluating \(x(z,\alpha)\) for a sampled set of altitudes \(z\).

---

## 9. Why all threshold curves have the same local slope

In the present model,

\[
x(z,\alpha) = R e_0 + R\delta(z) - R\alpha
\]

For a fixed time and station, \(e_0\) is constant. For a given threshold, \(-R\alpha\) is also constant.

Therefore, changing the threshold from horizon to civil, nautical, or astronomical twilight only shifts the curve horizontally. It does not change its shape.

The local derivative is

\[
\frac{dx}{dz} = R\frac{d\delta}{dz}
\]

and does not depend on \(\alpha\).

This means that, in the current spherical geometric model, the local inclination angle of the horizon, civil, nautical, and astronomical threshold profiles is the same at a given altitude. The profiles are horizontal translations of one another.

This is a feature of the current model, not a numerical bug.

---

## 10. Profile inclination angle

The profile inclination angle is measured relative to the local horizontal axis in the vertical cross-section.

If the curve is expressed as \(x(z)\), then locally

\[
\tan(\theta) = \frac{dz}{dx}
\]

so

\[
\theta = \arctan\left(\frac{dz}{dx}\right)
\]

Since

\[
\frac{dx}{dz} = R\frac{d\delta}{dz}
\]

we can write

\[
\theta(z) =
\arctan\left(\frac{1}{R\frac{d\delta}{dz}}\right)
\]

The derivative of the horizon-dip term is

\[
\frac{d\delta}{dz}
=
\frac{R}
{(R+z)^2
\sqrt{1-\left(\frac{R}{R+z}\right)^2}}
\]

for \(z>0\).

---

## 11. Ground-angle interpretation

At the exact ground surface, \(z=0\), the horizon-dip approximation behaves as

\[
\delta(z) \approx \sqrt{\frac{2z}{R}}
\]

so

\[
\frac{d\delta}{dz} \to \infty
\quad \text{as} \quad z \to 0^+
\]

and therefore

\[
\frac{dx}{dz} \to \infty
\]

which implies

\[
\frac{dz}{dx} \to 0
\]

Thus, in this model, the threshold curve is tangent to the ground at the ground-intersection point, and the limiting ground angle is

\[
\theta_g = 0^\circ
\]

Earlier numerical versions estimated the near-ground angle using a finite difference between \(z=0\) and a small positive altitude. This produced a small non-zero value. Such a number should be interpreted as an effective near-ground angle over a finite altitude interval, not as the mathematical tangent angle exactly at the ground.

The preferred interpretation in the current method is:

- **ground angle:** exact limiting angle at \(z=0\), equal to \(0^\circ\);
- **angle at 90 km / 110 km:** local finite-altitude inclination, computed from the same curve model.

---

## 12. Numerical angle estimates at selected altitudes

For practical displayed values at finite altitudes, such as 90 km and 110 km, the application may estimate the local tangent numerically using finite differences.

For an altitude \(z_0\), a central finite-difference approximation can be used:

\[
\frac{dx}{dz}\bigg|_{z_0}
\approx
\frac{x(z_0+\Delta z)-x(z_0-\Delta z)}
{2\Delta z}
\]

Then

\[
\theta(z_0)
\approx
\arctan\left(
\frac{2\Delta z}
{x(z_0+\Delta z)-x(z_0-\Delta z)}
\right)
\]

For \(z_0 = 0\), this finite-difference estimate is not the exact ground tangent. The exact limiting ground angle should be treated as \(0^\circ\) in the present model.

---

## 13. Full-profile and ground-zoom views

The application may provide two cross-section display modes.

### Full profile

The full-profile view is intended to show the large-scale structure of the threshold curves.

Typical ranges:

\[
x \in [-2500, +2500]\ \mathrm{km}
\]

\[
z \in [0, 2000]\ \mathrm{km}
\]

A logarithmic-like vertical display scale may be used, for example:

\[
y_{plot} = \log_{10}(z+1)
\]

The underlying physical altitude values remain in kilometres. Only the visual axis mapping is logarithmic-like.

This makes the near-ground and ionospheric regions easier to inspect while still showing the topside region.

### Ground zoom

The ground-zoom view is intended to inspect the region close to the selected station and ground-intersection point.

A typical display range is:

\[
x \in [-25, +25]\ \mathrm{km}
\]

\[
z \in [0, 25]\ \mathrm{km}
\]

In this view, linear axes and equal visual scaling are preferred, so that local inclinations can be interpreted directly.

---

## 14. Ionosphere reference bands

The cross-section view may display approximate ionospheric reference regions:

| Region | Approximate altitude range |
|---|---:|
| D region | 60–90 km |
| E region | 90–150 km |
| F1 region | 150–250 km |
| F2 region | 250–500 km |
| Topside ionosphere / plasmasphere | 500–2000 km |

These are visual reference bands only. Their exact physical boundaries vary with solar activity, season, latitude, local time, and geophysical conditions.

---

## 15. Event-time calculation

For morning and evening modes, the application searches for the UTC time on the selected date when the solar elevation at the station crosses the selected event anchor threshold.

The root condition is

\[
f(t)=e(t)-\alpha=0
\]

where:

- \(e(t)\) is the solar elevation at time \(t\);
- \(\alpha\) is the selected event threshold.

The application scans the selected UTC day and applies a root-finding method such as bisection to crossing intervals.

The crossing is classified as:

- **morning event:** solar elevation increasing through the threshold;
- **evening event:** solar elevation decreasing through the threshold.

If no crossing is detected, the application reports a diagnostic status instead of failing. Examples include:

- no crossing on selected date;
- always above threshold;
- always below threshold;
- polar day;
- polar night;
- white-night / missing astronomical twilight conditions.

---

## 16. Solar timeline panel

The solar timeline panel plots solar elevation over the selected UTC day.

It also displays the four reference threshold levels:

- \(0^\circ\),
- \(-6^\circ\),
- \(-12^\circ\),
- \(-18^\circ\).

The selected time is shown as a vertical marker. Diagnostic values may include:

- solar elevation at selected time;
- solar azimuth at selected time;
- cross-section azimuth;
- terminator-front azimuth;
- event time;
- threshold-specific ground-intersection distances and inclination angles.

---

## 17. Limitations of the MVP model

The current method is intentionally simplified.

Important limitations:

1. **Spherical Earth approximation**  
   The current model uses \(R=6371\ \mathrm{km}\), not a full WGS84 ellipsoid.

2. **No atmospheric refraction model**  
   The model does not currently include optical refraction near the horizon.

3. **No atmospheric scattering or sky brightness**  
   Civil, nautical, and astronomical thresholds are treated as geometric solar-elevation surfaces, not as brightness levels.

4. **No full 3D ray tracing**  
   The cross-section is a local geometric approximation, not a global volumetric shadow model.

5. **Threshold curves are parallel translations in the current model**  
   Because the model uses \(x(z,\alpha)=R(e_0+\delta(z)-\alpha)\), all threshold profiles have identical shape and local slope at the same altitude.

6. **Ground angle is a limiting quantity**  
   In the present model, the exact ground tangent angle is \(0^\circ\). Non-zero near-ground angles arise only from finite-difference estimates over non-zero altitude intervals.

7. **Map and Sun–Earth panels are schematic**  
   Until a more rigorous global geometry overlay is implemented, those panels should be treated as visual aids rather than authoritative geometric outputs.

---

## 18. Recommended validation checks

Recommended validation steps:

1. Compare solar elevation and azimuth against a trusted solar-position calculator for several dates, stations, and times.
2. Compare morning/evening threshold event times against independent sunrise/sunset/twilight calculators.
3. Test mid-latitude normal cases, summer white-night cases, polar day, and polar night.
4. Confirm that no output field displays `NaN`, `Infinity`, or silently invalid values.
5. Confirm that ground-intersection distances shift consistently when changing threshold level.
6. Confirm that threshold curves have the same shape and slope in the current model, differing only by horizontal displacement.
7. Confirm that the exact ground angle is reported as \(0^\circ\) in the current geometric model.

---

## 19. References and background sources

- Reda, I.; Andreas, A. (2008). *Solar Position Algorithm for Solar Radiation Applications*. National Renewable Energy Laboratory, NREL/TP-560-34302.
- Meeus, J. *Astronomical Algorithms*. Willmann-Bell.
- U.S. Naval Observatory definitions of civil, nautical, and astronomical twilight.
- NOAA solar calculator documentation and solar azimuth/elevation conventions.
- Station coordinate sources for LOFAR PL612 Bałdy and IGS LAMA should be verified and updated when authoritative station metadata are available.

---

## 20. Implementation note

This document describes the MVP geometric method. If the future version introduces a full 3D Earth-shadow model, WGS84 ellipsoidal geometry, atmospheric refraction, or ray tracing through altitude-dependent atmospheric layers, this method document should be updated accordingly.

The most important current interpretation rule is:

> TWILIGHT presently visualizes local geometric solar-elevation threshold surfaces, not physical optical brightness or radiative transfer.
