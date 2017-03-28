import tensorflow as tf

c1 = tf.constant(3.1)

print(c1)

s = tf.Session()
print(s.run(c1))
