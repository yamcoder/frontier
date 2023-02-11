## Определение принадлежности координат эллипса

Каноническое уравнение эллипса: x^2/a^2 + y^2/b^2 = 1
где a,b - полуоси эллипса

```typescript
((this.state.pointerX - this.x - this.radiusX) ** 2) / (this.radiusX ** 2) +
((this.state.pointerY - this.y - this.radiusY) ** 2) / (this.radiusY ** 2)
  <= 1;
```

## Определение принадлежности координат окружности

Каноническое уравнение окружности: x^2 + y^2 = r^2

```typescript
Math.sqrt(
  (this.state.pointerX - this.x - this.radius) ** 2 +
  (this.state.pointerY - this.y - this.radius) ** 2
) <= this.radius;
```
